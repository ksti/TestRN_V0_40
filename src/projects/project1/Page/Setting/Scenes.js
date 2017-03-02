
import AboutAppPage from './AboutAppPage'
import Feedback from  './Feedback'
import HelpHome from './HelpHome'
import ProfileSetPage from './ProfileSetPage'
import ServicePage from  './ServicePage'

const scenes = [
    {
        key:'aboutAppPage',
        comp:AboutAppPage
    },{
        key:'feedback',
        comp:Feedback,
    },{
        key:'workHomeHelp',
        comp:HelpHome,
    },{
        key:'profileSet',
        comp:ProfileSetPage,
    },{
        key:'service',
        comp:ServicePage,
    },    
];

export default scenes;

