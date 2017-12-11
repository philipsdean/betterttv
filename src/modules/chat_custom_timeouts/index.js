const $ = require('jquery');
const watcher = require('../../watcher');
const keyCodes = require('../../utils/keycodes');
const twitch = require('../../utils/twitch');

const CHAT_ROOM_SELECTOR = '.chat-room__container';
const CHAT_LINE_SELECTOR = '.chat-line__message';
const CHAT_LINE_USERNAME_SELECTOR = `${CHAT_LINE_SELECTOR} .chat-author__display-name`;
const CUSTOM_TIMEOUT_ID = 'bttv-custom-timeout-contain';
const CUSTOM_TIMEOUT_TEMPLATE = `
    <div id="${CUSTOM_TIMEOUT_ID}">
        <div class="text"></div>
        <svg class="back" width="80px" height="200px" version="1.1" viewBox="0 0 80 200" x="0px" y="0px">
            <rect id="purge-rect" fill-opacity="0.303979846" fill="#000000" sketch:type="MSShapeGroup" x="0" y="0" width="80" height="20"></rect>
            <rect id="ban-rect" fill-opacity="0.303979846" fill="#000000" sketch:type="MSShapeGroup" x="0" y="180" width="80" height="20"></rect>
            <path id="time-curve" d="M-5.68434189e-14,19.8046875 C15.9905561,51.8248392 9.84960937,154.183594 80,180" fill="none" stroke-opacity="0.3" stroke="#ACACAC" sketch:type="MSShapeGroup" transform="translate(40.000000, 99.902344) scale(-1, 1) translate(-40.000000, -99.902344) "></path>
            <path id="Ban" d="M34.5654297,11.9848633 C34.5654297,12.5268582 34.4628917,13.005369 34.2578125,13.4204102 C34.0527333,13.8354513 33.7768572,14.1772448 33.4301758,14.4458008 C33.0200175,14.768068 32.5695825,14.9975579 32.0788574,15.1342773 C31.5881323,15.2709968 30.9643593,15.3393555 30.2075195,15.3393555 L26.340332,15.3393555 L26.340332,4.43359375 L29.5703125,4.43359375 C30.3662149,4.43359375 30.9619121,4.46289033 31.3574219,4.52148438 C31.7529317,4.58007842 32.1313458,4.70214751 32.4926758,4.88769531 C32.8930684,5.0976573 33.1835928,5.36742999 33.3642578,5.69702148 C33.5449228,6.02661298 33.6352539,6.42089614 33.6352539,6.87988281 C33.6352539,7.39746353 33.5034193,7.83813295 33.2397461,8.2019043 C32.9760729,8.56567565 32.6245139,8.85742078 32.1850586,9.07714844 L32.1850586,9.13574219 C32.922367,9.28711013 33.5034158,9.61059323 33.9282227,10.1062012 C34.3530295,10.6018091 34.5654297,11.2280236 34.5654297,11.9848633 L34.5654297,11.9848633 Z M32.1264648,7.0703125 C32.1264648,6.80663931 32.08252,6.58447356 31.9946289,6.40380859 C31.9067378,6.22314363 31.7651377,6.07666072 31.5698242,5.96435547 C31.3403309,5.83251887 31.0620134,5.75073258 30.7348633,5.71899414 C30.4077132,5.6872557 30.0024438,5.67138672 29.519043,5.67138672 L27.7905273,5.67138672 L27.7905273,8.82080078 L29.6655273,8.82080078 C30.1196312,8.82080078 30.4809557,8.79760765 30.7495117,8.7512207 C31.0180677,8.70483375 31.2670887,8.60839917 31.496582,8.46191406 C31.7260754,8.31542896 31.8884273,8.12622186 31.9836426,7.89428711 C32.0788579,7.66235236 32.1264648,7.3876969 32.1264648,7.0703125 L32.1264648,7.0703125 Z M33.0566406,12.043457 C33.0566406,11.6040017 32.9907233,11.2548841 32.8588867,10.9960938 C32.7270501,10.7373034 32.4877947,10.517579 32.1411133,10.3369141 C31.9067371,10.2148431 31.6223161,10.1354982 31.2878418,10.098877 C30.9533675,10.0622557 30.5468774,10.0439453 30.0683594,10.0439453 L27.7905273,10.0439453 L27.7905273,14.1015625 L29.7094727,14.1015625 C30.3442415,14.1015625 30.8642558,14.0686038 31.2695312,14.0026855 C31.6748067,13.9367672 32.0068346,13.8159188 32.265625,13.6401367 C32.5390639,13.4497061 32.7392572,13.2324231 32.8662109,12.9882812 C32.9931647,12.7441394 33.0566406,12.4292011 33.0566406,12.043457 L33.0566406,12.043457 Z M42.8710938,15.3393555 L41.5014648,15.3393555 L41.5014648,14.4677734 C41.3793939,14.5507817 41.2146006,14.6667473 41.0070801,14.8156738 C40.7995595,14.9646004 40.5981455,15.0830074 40.402832,15.1708984 C40.1733387,15.2832037 39.9096695,15.3771969 39.6118164,15.4528809 C39.3139634,15.5285648 38.9648458,15.5664062 38.5644531,15.5664062 C37.8271448,15.5664062 37.202151,15.3222681 36.6894531,14.8339844 C36.1767552,14.3457007 35.9204102,13.7231483 35.9204102,12.9663086 C35.9204102,12.3461883 36.0534655,11.8444843 36.3195801,11.4611816 C36.5856947,11.0778789 36.9653296,10.7763683 37.4584961,10.5566406 C37.9565455,10.336913 38.554684,10.1879887 39.2529297,10.1098633 C39.9511754,10.0317379 40.7006796,9.97314473 41.5014648,9.93408203 L41.5014648,9.72167969 C41.5014648,9.40917813 41.4465338,9.15039165 41.3366699,8.9453125 C41.2268061,8.74023335 41.069337,8.57910215 40.8642578,8.46191406 C40.6689443,8.34960881 40.4345717,8.27392598 40.1611328,8.23486328 C39.8876939,8.19580059 39.6020523,8.17626953 39.3041992,8.17626953 C38.9428693,8.17626953 38.5400413,8.22387648 38.0957031,8.3190918 C37.651365,8.41430712 37.1923852,8.55224519 36.71875,8.73291016 L36.6455078,8.73291016 L36.6455078,7.33398438 C36.9140638,7.26074182 37.3022436,7.18017622 37.8100586,7.09228516 C38.3178736,7.00439409 38.8183569,6.96044922 39.3115234,6.96044922 C39.8876982,6.96044922 40.3894022,7.00805616 40.8166504,7.10327148 C41.2438986,7.1984868 41.613768,7.3608387 41.9262695,7.59033203 C42.2338883,7.81494253 42.4682609,8.10546697 42.6293945,8.46191406 C42.7905281,8.81836116 42.8710938,9.26025127 42.8710938,9.78759766 L42.8710938,15.3393555 Z M41.5014648,13.3251953 L41.5014648,11.0473633 C41.0815409,11.0717775 40.587161,11.1083982 40.0183105,11.1572266 C39.44946,11.2060549 38.9990251,11.276855 38.6669922,11.3696289 C38.2714824,11.4819342 37.9516614,11.656493 37.7075195,11.8933105 C37.4633777,12.1301281 37.3413086,12.4560526 37.3413086,12.8710938 C37.3413086,13.3398461 37.4829087,13.6926258 37.7661133,13.9294434 C38.0493178,14.1662609 38.4814424,14.284668 39.0625,14.284668 C39.5459009,14.284668 39.987791,14.1906748 40.3881836,14.0026855 C40.7885762,13.8146963 41.1596663,13.5888685 41.5014648,13.3251953 L41.5014648,13.3251953 Z M52.3632812,15.3393555 L50.9863281,15.3393555 L50.9863281,10.6811523 C50.9863281,10.3051739 50.9643557,9.95239423 50.9204102,9.62280273 C50.8764646,9.29321124 50.795899,9.03564546 50.6787109,8.85009766 C50.55664,8.64501851 50.3808605,8.49243214 50.1513672,8.39233398 C49.9218739,8.29223583 49.6240253,8.2421875 49.2578125,8.2421875 C48.8818341,8.2421875 48.4887716,8.33496001 48.0786133,8.52050781 C47.668455,8.70605562 47.2753925,8.94286965 46.8994141,9.23095703 L46.8994141,15.3393555 L45.5224609,15.3393555 L45.5224609,7.15820312 L46.8994141,7.15820312 L46.8994141,8.06640625 C47.3291037,7.70995916 47.7734352,7.43164163 48.2324219,7.23144531 C48.6914085,7.031249 49.1625952,6.93115234 49.6459961,6.93115234 C50.5297896,6.93115234 51.203611,7.19726296 51.6674805,7.72949219 C52.13135,8.26172141 52.3632812,9.02831531 52.3632812,10.0292969 L52.3632812,15.3393555 Z" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>
            <path id="Purge" d="M26.2561035,186.291992 C26.2561035,186.775393 26.1718758,187.223387 26.003418,187.635986 C25.8349601,188.048586 25.5993667,188.406248 25.2966309,188.708984 C24.9206524,189.084963 24.4763209,189.366942 23.963623,189.554932 C23.4509252,189.742921 22.803959,189.836914 22.0227051,189.836914 L20.5725098,189.836914 L20.5725098,193.901855 L19.1223145,193.901855 L19.1223145,182.996094 L22.0812988,182.996094 C22.735599,182.996094 23.2897927,183.051025 23.7438965,183.160889 C24.1980003,183.270753 24.6008283,183.44287 24.9523926,183.677246 C25.3674337,183.955568 25.6884754,184.302244 25.9155273,184.717285 C26.1425793,185.132326 26.2561035,185.657223 26.2561035,186.291992 L26.2561035,186.291992 Z M24.7473145,186.328613 C24.7473145,185.952635 24.6813971,185.62549 24.5495605,185.347168 C24.417724,185.068846 24.2175306,184.841798 23.9489746,184.666016 C23.7145984,184.514648 23.4472671,184.406006 23.1469727,184.340088 C22.8466782,184.27417 22.4670433,184.241211 22.0080566,184.241211 L20.5725098,184.241211 L20.5725098,188.599121 L21.7956543,188.599121 C22.3815947,188.599121 22.8576642,188.546631 23.223877,188.44165 C23.5900897,188.336669 23.8879383,188.169435 24.1174316,187.939941 C24.346925,187.705565 24.5092769,187.458986 24.6044922,187.200195 C24.6997075,186.941405 24.7473145,186.650881 24.7473145,186.328613 L24.7473145,186.328613 Z M34.8400879,193.901855 L33.4631348,193.901855 L33.4631348,192.993652 C32.9992653,193.359865 32.5549338,193.640624 32.130127,193.835938 C31.7053201,194.031251 31.2365748,194.128906 30.723877,194.128906 C29.8644977,194.128906 29.195559,193.866458 28.717041,193.341553 C28.238523,192.816648 27.9992676,192.046392 27.9992676,191.030762 L27.9992676,185.720703 L29.3762207,185.720703 L29.3762207,190.378906 C29.3762207,190.793947 29.3957518,191.149168 29.4348145,191.44458 C29.4738771,191.739992 29.5568841,191.992675 29.6838379,192.202637 C29.8156745,192.417482 29.9865712,192.57373 30.1965332,192.671387 C30.4064952,192.769043 30.7116679,192.817871 31.1120605,192.817871 C31.4685076,192.817871 31.857908,192.725099 32.2802734,192.539551 C32.7026388,192.354003 33.096922,192.117189 33.4631348,191.829102 L33.4631348,185.720703 L34.8400879,185.720703 L34.8400879,193.901855 Z M42.6550293,187.222168 L42.5817871,187.222168 C42.376708,187.17334 42.1777353,187.13794 41.9848633,187.115967 C41.7919912,187.093994 41.563722,187.083008 41.3000488,187.083008 C40.875242,187.083008 40.4650899,187.177001 40.0695801,187.36499 C39.6740703,187.552979 39.2932147,187.795897 38.927002,188.09375 L38.927002,193.901855 L37.5500488,193.901855 L37.5500488,185.720703 L38.927002,185.720703 L38.927002,186.929199 C39.4738797,186.489744 39.9560526,186.178468 40.3735352,185.995361 C40.7910177,185.812255 41.2170388,185.720703 41.6516113,185.720703 C41.8908703,185.720703 42.0642084,185.726807 42.1716309,185.739014 C42.2790533,185.751221 42.4401845,185.774414 42.6550293,185.808594 L42.6550293,187.222168 Z M50.5871582,192.97168 C50.5871582,194.358405 50.2722199,195.376462 49.642334,196.025879 C49.012448,196.675296 48.0432194,197 46.7346191,197 C46.3000467,197 45.8764669,196.969483 45.4638672,196.908447 C45.0512675,196.847412 44.6447774,196.760743 44.2443848,196.648438 L44.2443848,195.242188 L44.317627,195.242188 C44.5422375,195.330079 44.8986792,195.43872 45.3869629,195.568115 C45.8752466,195.69751 46.3635229,195.762207 46.8518066,195.762207 C47.320559,195.762207 47.7087387,195.706055 48.0163574,195.59375 C48.3239761,195.481445 48.5632316,195.325196 48.7341309,195.125 C48.9050302,194.934569 49.0270992,194.705079 49.1003418,194.436523 C49.1735844,194.167967 49.2102051,193.867677 49.2102051,193.535645 L49.2102051,192.788574 C48.7951639,193.120607 48.3984394,193.368407 48.0200195,193.531982 C47.6415997,193.695557 47.1594268,193.777344 46.5734863,193.777344 C45.5969189,193.777344 44.8217802,193.424564 44.2480469,192.718994 C43.6743135,192.013424 43.3874512,191.018561 43.3874512,189.734375 C43.3874512,189.031246 43.4863271,188.424563 43.684082,187.914307 C43.8818369,187.40405 44.1516096,186.963381 44.4934082,186.592285 C44.8107926,186.245604 45.1965309,185.975831 45.6506348,185.782959 C46.1047386,185.590087 46.5563942,185.493652 47.0056152,185.493652 C47.4792504,185.493652 47.875975,185.541259 48.1958008,185.636475 C48.5156266,185.73169 48.853758,185.876952 49.2102051,186.072266 L49.2980957,185.720703 L50.5871582,185.720703 L50.5871582,192.97168 Z M49.2102051,191.65332 L49.2102051,187.192871 C48.8439923,187.026855 48.5034195,186.908448 48.1884766,186.837646 C47.8735336,186.766845 47.559816,186.731445 47.2473145,186.731445 C46.4904747,186.731445 45.8947776,186.985349 45.4602051,187.493164 C45.0256326,188.000979 44.8083496,188.738276 44.8083496,189.705078 C44.8083496,190.623051 44.9694808,191.318845 45.291748,191.79248 C45.6140153,192.266116 46.1486779,192.50293 46.895752,192.50293 C47.2961446,192.50293 47.6977519,192.426026 48.1005859,192.272217 C48.50342,192.118407 48.8732893,191.912111 49.2102051,191.65332 L49.2102051,191.65332 Z M60.1452637,189.954102 L54.1174316,189.954102 C54.1174316,190.457034 54.1931145,190.895262 54.3444824,191.268799 C54.4958504,191.642336 54.7033678,191.948729 54.967041,192.187988 C55.2209485,192.422364 55.5224592,192.598144 55.871582,192.715332 C56.2207049,192.83252 56.6052225,192.891113 57.0251465,192.891113 C57.5817899,192.891113 58.142087,192.78003 58.7060547,192.557861 C59.2700224,192.335692 59.6716297,192.117189 59.9108887,191.902344 L59.9841309,191.902344 L59.9841309,193.403809 C59.5202614,193.599122 59.0466333,193.762695 58.5632324,193.894531 C58.0798316,194.026368 57.5720241,194.092285 57.0397949,194.092285 C55.6823663,194.092285 54.6228065,193.724857 53.861084,192.98999 C53.0993614,192.255123 52.7185059,191.211433 52.7185059,189.858887 C52.7185059,188.520989 53.0834924,187.458988 53.8134766,186.672852 C54.5434607,185.886715 55.5041444,185.493652 56.6955566,185.493652 C57.7990778,185.493652 58.6498994,185.815915 59.2480469,186.460449 C59.8461944,187.104984 60.1452637,188.020502 60.1452637,189.207031 L60.1452637,189.954102 Z M58.8049316,188.899414 C58.8000488,188.176754 58.6181659,187.617678 58.2592773,187.222168 C57.9003888,186.826658 57.35474,186.628906 56.6223145,186.628906 C55.8850061,186.628906 55.2978537,186.846189 54.8608398,187.280762 C54.4238259,187.715334 54.1760257,188.25488 54.1174316,188.899414 L58.8049316,188.899414 Z" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>
        </svg>
        <div class="cursor"></div>
    </div>
`;
const ActionTypes = {
    CANCEL: 'cancel',
    TIMEOUT: 'timeout',
    BAN: 'ban'
};

let action;
let user;

function setReason(type) {
    const reason = prompt(`Enter ${type} reason: (leave blank for none)`);
    return reason || '';
}

function handleTimeoutClick(e) {
    const $customTimeout = $(`#${CUSTOM_TIMEOUT_ID}`);
    if (!$customTimeout.length || e.which === keyCodes.DOMVKCancel) return;

    if ($customTimeout.is(':hover')) {
        let command;
        let duration;
        if (action.type === ActionTypes.BAN) {
            command = '/ban';
        } else if (action.type === ActionTypes.TIMEOUT) {
            command = '/timeout';
            duration = action.length;
        }
        if (command) {
            const reason = e.shiftKey ? setReason(action.type) : '';
            twitch.sendChatMessage(`${command} ${user}${duration ? ` ${duration}` : ''}${reason ? ` ${reason}` : ''}`);
        }
    }

    $customTimeout.remove();
}

function handleMouseMove(e) {
    const $customTimeout = $(`#${CUSTOM_TIMEOUT_ID}`);
    if (!$customTimeout.length) return;

    const offset = e.pageY - $customTimeout.offset().top;
    const offsetx = e.pageX - $customTimeout.offset().left;
    const amount = 200 - offset;
    const time = Math.floor(Math.pow(1.5, (amount - 20) / 7) * 60);

    let humanTime;
    if (Math.floor(time / 60 / 60 / 24) > 0) {
        humanTime = `${Math.floor(time / 60 / 60 / 24)} Days`;
    } else if (Math.floor(time / 60 / 60) > 0) {
        humanTime = `${Math.floor(time / 60 / 60)} Hours`;
    } else {
        humanTime = `${Math.floor(time / 60)} Minutes`;
    }

    if (amount > 200 || amount < 0 || offsetx > 80 || offsetx < 0) {
        action = {
            type: ActionTypes.CANCEL,
            length: 0,
            text: 'CANCEL'
        };
    } else if (amount > 20 && amount < 180) {
        action = {
            type: ActionTypes.TIMEOUT,
            length: time,
            text: humanTime
        };
    } else if (amount >= 180 && amount < 200) {
        action = {
            type: ActionTypes.BAN,
            length: 0,
            text: 'BAN'
        };
    } else if (amount > 0 && amount <= 20) {
        action = {
            type: ActionTypes.TIMEOUT,
            length: 2,
            text: 'PURGE'
        };
    }

    $customTimeout.find('.text').text(action.text);
    $customTimeout.find('.cursor').css('top', offset);
}

function openCustomTimeout($target) {
    if ($(`#${CUSTOM_TIMEOUT_ID}`).length) return;

    const $chat = $(CHAT_ROOM_SELECTOR);
    $chat.append(CUSTOM_TIMEOUT_TEMPLATE);

    const $customTimeout = $(`#${CUSTOM_TIMEOUT_ID}`);

    $customTimeout.css({
        top: $target.offset().top + ($target.height() / 2) - ($customTimeout.height() / 2),
        left: $chat.offset().left - $customTimeout.width() + $chat.width() - 20
    });

    action = {
        type: ActionTypes.CANCEL,
        length: 0,
        text: 'CANCEL'
    };

    $customTimeout.on('mousemove', handleMouseMove);
    $customTimeout.on('mousedown', handleTimeoutClick);
}

function handleClick(e) {
    if (!twitch.getCurrentUserIsModerator()) return;
    e.preventDefault();

    const $chatLine = $(e.currentTarget).closest(CHAT_LINE_SELECTOR);
    const msgObject = twitch.getChatMessageObject($chatLine[0]);
    if (!msgObject) return;
    user = msgObject.user.userLogin;
    openCustomTimeout($(e.currentTarget));
}

class ChatCustomTimeoutsModule {
    constructor() {
        watcher.on('load.chat', () => this.loadClickHandler());
    }

    loadClickHandler() {
        $(CHAT_ROOM_SELECTOR)
            .off('contextmenu', CHAT_LINE_USERNAME_SELECTOR, handleClick)
            .on('contextmenu', CHAT_LINE_USERNAME_SELECTOR, handleClick)
            .off('click', handleTimeoutClick)
            .on('click', handleTimeoutClick);
    }
}

module.exports = new ChatCustomTimeoutsModule();
