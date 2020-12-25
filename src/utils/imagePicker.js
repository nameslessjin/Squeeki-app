import ImagePicker from 'react-native-image-picker'

export const backgroundImagePicker = (setImage) => {
    const options = {
        quality: 1.0,
        maxWidth: 600,
        maxHeight: 600,
        storageOptions: {
            skipBackup: true
        }
    }

    ImagePicker.showImagePicker(options, response => {


        if (response.didCancel){
            console.log('Cancelled')
        } else if (response.error){
            console.log('ImagePicker Error: ', response.error)
        } else if (response.customButton){
            console.log(response.customButton)
        } else {
            let name = response.uri.split('/')
            name = name[name.length-1]
            let source = {
                uri: response.uri,
                width: response.height,
                height: response.width,
                type: response.type,
                filename: name,
                data: response.data
            }


            setImage(source, 'background')

        }
    })
}

export const iconImagePicker = (setImage) => {
    const options = {
        quality: 1.0,
        maxWidth: 200,
        maxHeight: 200,
        storageOptions: {
            skipBackup: true
        }
    }

    ImagePicker.showImagePicker(options, response => {
        console.log('Response = ', response)

        if (response.didCancel){
            console.log('Cancelled')
        } else if (response.error){
            console.log('ImagePicker Error: ', response.error)
        } else if (response.customButton){
            console.log(response.customButton)
        } else {
            let name = response.uri.split('/')
            name = name[name.length-1]
            let source = {
                uri: response.uri,
                width: response.height,
                height: response.width,
                type: response.type,
                filename: name,
                data: response.data
            }
            console.log(response)

            setImage(source, 'icon')

        }
    })
}

export const PostImagePicker = (setImage) => {
    const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
            skipBackup: true
        }
    }

    ImagePicker.showImagePicker(options, response => {
        console.log('Response = ', response)

        if (response.didCancel){
            console.log('Cancelled')
        } else if (response.error){
            console.log('ImagePicker Error: ', response.error)
        } else if (response.customButton){
            console.log(response.customButton)
        } else {
            let name = response.uri.split('/')
            name = name[name.length-1]
            let source = {
                uri: response.uri,
                width: response.height,
                height: response.width,
                type: response.type,
                filename: name,
                data: response.data
            }


            setImage(source, 'image')

        }
    })
}