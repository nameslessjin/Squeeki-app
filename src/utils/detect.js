import Clipboard from '@react-native-clipboard/clipboard';

export const detectFile = text => {
    let t = text
    t = t.split('/')
    if (t[0] == 'file:' && t[1].length == 0 && t[2].length == 0){
        let file = t[t.length - 1]
        file = file.split('.')
        const type = file[file.length - 1]
        if (type == 'jpg' || type == 'png'){
            return {is_image: true, imageType: type}
        }
    }

    return {is_image: false}
}