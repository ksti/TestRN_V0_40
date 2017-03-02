
import GestureLogin from './GestureLogin'
import GestureReset from './GestureReset'
import SetGesturePwd from './SetGesturePwd'
import ValideInterval from './ValideInterval'

const scenes = [
    {
        key:'gestureReset',
        comp:GestureReset,
    },{
        key:'setValidTime',
        comp:ValideInterval,
    },/*{
        key:'setGesturePwd', // 在root里单独配置，与tabbar同级
        comp:SetGesturePwd,
    }*/
];

export default scenes;

