import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

export const backgroundImagePicker = (setImage, from, cancel) => {
    const options = {
        quality: 1.0,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: true
    }

    if (from == 'library') {
        launchImageLibrary(options, response => {
            if (response.didCancel){
                cancel()
            } else if (response.error){
                console.log('ImagePicker Error: ', response.error)
            } else {
                let name = response.uri.split('/')
                name = name[name.length-1]
                let source = {
                    uri: response.uri,
                    width: response.height,
                    height: response.width,
                    type: response.type,
                    filename: name,
                    data: response.base64
                }
    
                setImage(source, 'background')
    
            }
        })
    } else {
        launchCamera(options, response => {
            if (response.didCancel){
                cancel()
            } else if (response.error){
                console.log('ImagePicker Error: ', response.error)
            } else {
                let name = response.uri.split('/')
                name = name[name.length-1]
                let source = {
                    uri: response.uri,
                    width: response.height,
                    height: response.width,
                    type: response.type,
                    filename: name,
                    data: response.base64
                }
    
                setImage(source, 'background')
    
            }
        })
    }
}

export const iconImagePicker = (setImage, from, cancel) => {
    const options = {
        quality: 1.0,
        maxWidth: 400,
        maxHeight: 400,
        includeBase64: true
    }

    if (from == 'library') {
        launchImageLibrary(options, response => {
            if (response.didCancel){
                cancel()
            } else if (response.error){
                console.log('ImagePicker Error: ', response.error)
            } else {
                let name = response.uri.split('/')
                name = name[name.length-1]
                let source = {
                    uri: response.uri,
                    width: response.height,
                    height: response.width,
                    type: response.type,
                    filename: name,
                    data: response.base64
                }
    
                setImage(source, 'icon')
    
            }
        })
    } else {
        launchCamera(options, response => {
            if (response.didCancel){
                cancel()
            } else if (response.error){
                console.log('ImagePicker Error: ', response.error)
            } else {
                let name = response.uri.split('/')
                name = name[name.length-1]
                let source = {
                    uri: response.uri,
                    width: response.height,
                    height: response.width,
                    type: response.type,
                    filename: name,
                    data: response.base64
                }
    
                setImage(source, 'icon')
    
            }
        })
    }
}

export const PostImagePicker = (setImage, from, cancel) => {
    const options = {
        quality: 1.0,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: true
    }

    if (from == 'library') {
        launchImageLibrary(options, response => {
            if (response.didCancel){
                cancel()
            } else if (response.error){
                console.log('ImagePicker Error: ', response.error)
            } else {
                let name = response.uri.split('/')
                name = name[name.length-1]
                let source = {
                    uri: response.uri,
                    width: response.height,
                    height: response.width,
                    type: response.type,
                    filename: name,
                    data: response.base64
                }
    
                setImage(source, 'image')
    
            }
        })
    } else {
        launchCamera(options, response => {
            if (response.didCancel){
                cancel()
            } else if (response.error){
                console.log('ImagePicker Error: ', response.error)
            } else {
                let name = response.uri.split('/')
                name = name[name.length-1]
                let source = {
                    uri: response.uri,
                    width: response.height,
                    height: response.width,
                    type: response.type,
                    filename: name,
                    data: response.base64
                }
    
                setImage(source, 'image')
    
            }
        })
    }
    
}