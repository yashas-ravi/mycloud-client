import * as DocumentPicker from "expo-document-picker";
import { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { icons } from '../constants/index';
import FeaturesMenu from './FeaturesMenu';

const UploadFileModel = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpload=async()=>{
        try {
            const result = await DocumentPicker.getDocumentAsync({
            type: "*/*",
            multiple: false,
            copyToCacheDirectory: true,
        });
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
        });
        console.log(result.assets.uri);
        }catch(err){
            console.log("error while uploading file",err);
          }
        }

    return (
    <View>
      <FeaturesMenu
        icon={icons.upload}
        title="Upload Files"
        handlePress={()=>{
          setVisible(true);
        }}
      />
      <Modal visible={visible} transparent animationType='slide'>
          <View className="flex-1 bg-black/40 justify-center items-center">
              <View className="bg-white w-[80%] rounded-md max-h-[80vh] min-h-[50vh] p-2">
                <View className="flex-row justify-between px-4 items-center border-b-2 border-gray-200 h-[50px]">
                  <Text className="text-black font-mbold text-[18px]">Upload Files</Text>
                  <TouchableOpacity onPress={()=>setVisible(false)}>
                    <Text className="text-red-400 font-mbold text-[15px]">Close</Text>
                  </TouchableOpacity>
                </View>
                <View className="items-center justify-center p-5 h-[20vh] gap-y-4">
                    <Text className="flex-col text-black font-mmedium text-[18px]">Select File</Text>
                    <CustomButton
                    title="Upload"
                    handlePress={handleUpload}
                    />
                  </View>
              </View>
          </View>      
      </Modal>
    </View>
  )
}

export default UploadFileModel