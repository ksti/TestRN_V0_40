import React, {
    PropTypes,
    Component
} from 'react';
import ReactNative, {
    requireNativeComponent,
    EdgeInsetsPropType,
    StyleSheet,
    UIManager,
    View,
    NativeModules,
    Text,
    ActivityIndicator,
    Platform
} from 'react-native';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

import deprecatedPropType from 'react-native/Libraries/Utilities/deprecatedPropType';

import invariant from 'fbjs/lib/invariant';
import keyMirror from 'fbjs/lib/keyMirror';

var YuanXinWebViewManager = NativeModules.YuanXinWebViewManager;

var BGWASH = 'rgba(255,255,255,0.8)';
var RCT_WEBVIEW_REF = 'webview';

var WebViewState = keyMirror({
    IDLE: null,
    LOADING: null,
    ERROR: null,
});

const NavigationType = keyMirror({
    click: true,
    formsubmit: true,
    backforward: true,
    reload: true,
    formresubmit: true,
    other: true,
});

const JSNavigationScheme = 'react-js-navigation';

type ErrorEvent = {
    domain: any;
    code: any;
    description: any;
}

type Event = Object;

var defaultRenderLoading = () => (
    <View style={styles.loadingView}>
        <ActivityIndicator />
    </View>
);
var defaultRenderError = (errorDomain, errorCode, errorDesc) => (
    <View style={styles.errorContainer}>
        <Text style={styles.errorTextTitle}>
            Error loading page
        </Text>
        <Text style={styles.errorText}>
            {'Domain: ' + errorDomain}
        </Text>
        <Text style={styles.errorText}>
            {'Error Code: ' + errorCode}
        </Text>
        <Text style={styles.errorText}>
            {'Description: ' + errorDesc}
        </Text>
    </View>
);

/**
 * Renders a native WebView.
 */
export default class YuanXinWebView extends Component {

    static defaultProps = {
        JSNavigationScheme: JSNavigationScheme,
        NavigationType: NavigationType,
    }

    static propTypes = {
        ...View.propTypes,
        html: PropTypes.string,

        url: PropTypes.string,


        /**
         * Loads static html or a uri (with optional headers) in the WebView.
         */
        source: PropTypes.oneOfType([
            PropTypes.shape({
                /*
                 * The URI to load in the WebView. Can be a local or remote file.
                 */
                uri: PropTypes.string,
                /*
                 * The HTTP Method to use. Defaults to GET if not specified.
                 * NOTE: On Android, only GET and POST are supported.
                 */
                method: PropTypes.string,
                /*
                 * Additional HTTP headers to send with the request.
                 * NOTE: On Android, this can only be used with GET requests.
                 */
                headers: PropTypes.object,
                /*
                 * The HTTP body to send with the request. This must be a valid
                 * UTF-8 string, and will be sent exactly as specified, with no
                 * additional encoding (e.g. URL-escaping or base64) applied.
                 * NOTE: On Android, this can only be used with POST requests.
                 */
                body: PropTypes.string,
            }),
            PropTypes.shape({
                /*
                 * A static HTML page to display in the WebView.
                 */
                html: PropTypes.string,
                /*
                 * The base URL to be used for any relative links in the HTML.
                 */
                baseUrl: PropTypes.string,
            }),
            /*
             * Used internally by packager.
             */
            PropTypes.number,
        ]),

        /**
         * Function that returns a view to show if there's an error.
         */
        renderError: PropTypes.func, // view to show if there's an error
        /**
         * Function that returns a loading indicator.
         */
        renderLoading: PropTypes.func,
        /**
         * Invoked when load finish
         */
        onLoad: PropTypes.func,
        /**
         * Invoked when load either succeeds or fails
         */
        onLoadEnd: PropTypes.func,
        /**
         * Invoked on load start
         */
        onLoadStart: PropTypes.func,
        /**
         * Invoked when load fails
         */
        onError: PropTypes.func,
        /**
         * Report the progress
         */
        onProgress: PropTypes.func,
        /**
        * Report the onBridgeMessage
        */
        onBridgeMessage: PropTypes.func,
        /**
         * @platform ios
         */
        bounces: PropTypes.bool,
        scrollEnabled: PropTypes.bool,
        automaticallyAdjustContentInsets: PropTypes.bool,
        contentInset: EdgeInsetsPropType,
        onNavigationStateChange: PropTypes.func,
        scalesPageToFit: PropTypes.bool,
        startInLoadingState: PropTypes.bool,
        style: View.propTypes.style,
        /**
         * Sets the JS to be injected when the webpage loads.
         */
        injectedJavaScript: PropTypes.string,
        /**
         * Allows custom handling of any webview requests by a JS handler. Return true
         * or false from this method to continue loading the request.
         * @platform ios
         */
        onShouldStartLoadWithRequest: PropTypes.func,
        /**
         * Copies cookies from sharedHTTPCookieStorage when calling loadRequest.
         * Set this to true to emulate behavior of WebView component
         */
        sendCookies: PropTypes.bool,
        /**
         * clear cookies from sharedHTTPCookieStorage when calling loadRequest.
         * Set this to true if you need clear cookies.
         */
        clearCookies: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.state = {
            viewState: WebViewState.IDLE,
            lastErrorEvent: (null: ?ErrorEvent),
            startInLoadingState: true,
        };


    }

    componentWillMount() {
        if (this.props.startInLoadingState) {
            this.setState({ viewState: WebViewState.LOADING });
        }
    }

    render() {
        var otherView = null;

        if (this.state.viewState === WebViewState.LOADING) {
            otherView = (this.props.renderLoading || defaultRenderLoading)();
        } else if (this.state.viewState === WebViewState.ERROR) {
            var errorEvent = this.state.lastErrorEvent;
            invariant(
                errorEvent != null,
                'lastErrorEvent expected to be non-null'
            );
            otherView = (this.props.renderError || defaultRenderError)(
                errorEvent.domain,
                errorEvent.code,
                errorEvent.description
            );
        } else if (this.state.viewState !== WebViewState.IDLE) {
            console.error(
                'RCTWKWebView invalid state encountered: ' + this.state.loading
            );
        }

        var webViewStyles = [styles.container, styles.webView, this.props.style];
        if (this.state.viewState === WebViewState.LOADING ||
            this.state.viewState === WebViewState.ERROR) {
            // if we're in either LOADING or ERROR states, don't show the webView
            webViewStyles.push(styles.hidden);
        }

        var onShouldStartLoadWithRequest = this.props.onShouldStartLoadWithRequest && ((event: Event) => {
            var shouldStart = this.props.onShouldStartLoadWithRequest &&
                this.props.onShouldStartLoadWithRequest(event.nativeEvent);
            YuanXinWebViewManager.startLoadWithResult(!!shouldStart, event.nativeEvent.lockIdentifier);
        });

        var source = this.props.source || {};
        if (this.props.html) {
            source.html = this.props.html;
        } else if (this.props.url) {
            source.uri = this.props.url;
        }

        var webView =
            <RCTYuanXinWebView
                {...this.props}
                ref={RCT_WEBVIEW_REF}
                key="webViewKey"
                style={webViewStyles}
                source={resolveAssetSource(source) }
                injectedJavaScript={this.props.injectedJavaScript}
                bounces={this.props.bounces}
                scrollEnabled={this.props.scrollEnabled}
                contentInset={this.props.contentInset}
                automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
                sendCookies={this.props.sendCookies}
                clearCookies={this.props.clearCookies}
                onLoadingStart={this._onLoadingStart.bind(this) }
                onLoadingFinish={this._onLoadingFinish.bind(this) }
                onLoadingError={this._onLoadingError.bind(this) }
                onProgress={this._onProgress.bind(this)}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                onBridgeMessage={this._onBridgeMessage.bind(this) }
                />;

        return (
            <View style={styles.container}>
                {webView}
                {otherView}
            </View>
        );
    }

    /**
     * Go forward one page in the webview's history.
     */
    goForward() {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.YuanXinWebView.Commands.goForward,
            null
        );
    }

    /**
     * Go back one page in the webview's history.
     */
    goBack() {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.YuanXinWebView.Commands.goBack,
            null
        );
    }

    /**
     * Reloads the current page.
     */
    reload() {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RCTWKWebView.Commands.reload,
            null
        );
    }

    /**
     * 将消息发回给WebView
     */
    sendToBridge(value: string) {
        YuanXinWebViewManager.sendToBridge(this.getWebViewHandle(), value);
    }

    /**
     * 将消息发回给WebView
     */
    sendDataToBridge(params) {
        YuanXinWebViewManager.sendObjectToBridge(this.getWebViewHandle(), params);
    }

    //
    evaluateScript(script: string): Promise {
        console.log('HERE');
        if (Platform.OS === 'android') {
            return new Promise((resolve, reject) => {
                YuanXinWebViewManager.evaluateScript(this.getWebViewHandle(), script, resolve, reject);
            });
        }
        return YuanXinWebViewManager.evaluateScript(this.getWebViewHandle(), script);
    }

    /**
     * We return an event with a bunch of fields including:
     *  url, title, loading, canGoBack, canGoForward
     */
    _updateNavigationState(event) {
        if (this.props.onNavigationStateChange) {
            this.props.onNavigationStateChange(event.nativeEvent);
        }
    }

    /**
     * Returns the native webview node.
     */
    getWebViewHandle(): any {
        return ReactNative.findNodeHandle(this.refs[RCT_WEBVIEW_REF]);
    }

    _onLoadingStart(event) {
        var {onLoadStart} = this.props;
        if (onLoadStart) {
            onLoadStart(event);
        }
        this._updateNavigationState(event);
    }

    _onLoadingError(event: Event) {
        event.persist(); // persist this event because we need to store it
        var {onError, onLoadEnd} = this.props;
        if (onError) {
            onError(event);
        }
        if (onLoadEnd) {
            onLoadEnd(event);
        }

        console.warn('Encountered an error loading page', event.nativeEvent);

        this.setState({
            lastErrorEvent: event.nativeEvent,
            viewState: WebViewState.ERROR
        });
    }

    _onLoadingFinish(event: Event) {
        var {onLoad, onLoadEnd} = this.props;

        if (onLoad) {
            onLoad(event);
        }
        if (onLoadEnd) {
            onLoadEnd(event);
        }
        this.setState({
            viewState: WebViewState.IDLE,
        });
        //this.onLoad && onLoad(event);
        //onLoadEnd && onLoadEnd(event);
        this._updateNavigationState(event);
    }

    _onProgress(event: Event) {
        if (!this.props.onProgress) {
            return;
        }
        this.props.onProgress(event.nativeEvent.progress);
        //var onProgress = this.props.onProgress;
        //onProgress && onProgress(event.nativeEvent.progress);
    }

    _onBridgeMessage(event: Event) {
        if (!this.props.onBridgeMessage) {
            return;
        }
        this.props.onBridgeMessage(event.nativeEvent.messages);
    }
}

var RCTYuanXinWebView = requireNativeComponent('YuanXinWebView', YuanXinWebView, {
    nativeOnly: {
        onLoadingStart: true,
        onLoadingError: true,
        onLoadingFinish: true,
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BGWASH,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 2,
    },
    errorTextTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10,
    },
    hidden: {
        height: 0,
        flex: 0, // disable 'flex:1' when hiding a View
    },
    loadingView: {
        backgroundColor: BGWASH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
    webView: {
        backgroundColor: '#ffffff',
    }
});