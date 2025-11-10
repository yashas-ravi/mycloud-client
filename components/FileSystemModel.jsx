import * as FileSystem from "expo-file-system";
import { writeAsStringAsync } from 'expo-file-system/legacy';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { icons } from '../constants/index';
import { useWebRTC } from '../context/WebRTCProvider';
import FeaturesMenu from './FeaturesMenu';

const FileSystemModel = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backlink, setBacklink] = useState([]);
  const [files, setFiles] = useState(null);
  const {rtc} = useWebRTC();

  const fetchFiles=async(dir,d)=>{
    try {
      if(rtc){
        setLoading(true);
        const data = d ? await rtc?.sendCommand(`FILESYS:${dir}`): await rtc?.sendCommand(`FILESYS.${dir}`);
        setFiles(JSON.parse(data));
        if(d){
          const base64Data = files.data;
          const filePath = `${FileSystem.externalStorageDirectory}Download/${files.name}`;
          await writeAsStringAsync(filePath, base64Data, {
            encoding: FileSystem.EncodingType.UTF8,
          }); 
          console.log('File saved successfully!');
          Alert.alert("Download complete", `Saved to ${filePath}`);
        }
      }
    } catch (error) {
      console.log("Error",error);
    }finally{
      setLoading(false);
    }
  }

  return (
    <View>
      <FeaturesMenu
        icon={icons.folder}
        title="Files"
        handlePress={()=>{
          setVisible(true);
          fetchFiles("/home");
        }}
      />
      <Modal visible={visible} transparent animationType='slide'>
          <View className="flex-1 bg-black/40 justify-center items-center">
              <View className="bg-white w-[80%] rounded-md max-h-[80vh] min-h-[50vh] p-2">
                <View className="flex-row justify-between px-4 items-center border-b-2 border-gray-200 h-[50px]">
                  <Text className="text-black font-mbold text-[18px]">Files</Text>
                  <TouchableOpacity onPress={()=>setVisible(false)}>
                    <Text className="text-red-400 font-mbold text-[15px]">Close</Text>
                  </TouchableOpacity>
                </View>
                <View className="py-[2vh] max-h-[60vh]">
                  {backlink&&<TouchableOpacity
                  className="flex-row px-2 gap-x-3 items-center"
                  onPress={()=>fetchFiles(backlink.pop())}
                  >
                  <Image
                    source={icons.leftArrow}
                    resizeMode='contain'
                    className="w-6 h-6"
                    tintColor="#56cfe1"
                  />
                  <Text className="font-msemibold text-[13px]">Back</Text>     
                  </TouchableOpacity>}
                  {loading?<View className="h-[20vh] w-full items-center justify-center"><ActivityIndicator color="#56cfe1" size="large"/></View>:<FlatList
                    data={files}
                    keyExtractor={(item,index)=>`${item.name}-${index}`}
                    ListEmptyComponent={
                      <View className="items-center justify-center h-[10vh] w-full">
                        <Text className="font-mmedium text-lg text-black">Nothing To Show :)</Text>
                      </View>
                    }
                    renderItem={({item})=>(
                      <TouchableOpacity 
                      onPress={()=>{
                        if(item.type==="folder"){
                          fetchFiles(item.path+"/"+item.name, 0);
                          backlink.push(item.path);
                        }
                        else{
                          fetchFiles(item.path+"/"+item.name,1);
                          backlink.push(item.path);
                        }
                      }}
                      className="p-2 bg-sky-100 flex-row mx-2 mt-2 gap-x-2">
                            <Image
                            source={item.type==="folder"?icons.folder:icons.page}
                            resizeMode='contain'
                            className="w-6 h-6"
                            tintColor="#56cfe1"
                            />
                             <Text className="font-mmedium text-[15px] text-black px-2">{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />}
                  </View>
              </View>
          </View>      
      </Modal>
    </View>
  )
}

export default FileSystemModel;