import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DrawerIcon = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{marginLeft: 10, marginRight: 100}}>
      <Icon
        name="menu"
        size={30}
        color="#fff"
      />
    </TouchableOpacity>
  );
};

export default DrawerIcon;