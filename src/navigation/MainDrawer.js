import React, {useState} from 'react';
import {View} from 'react-native';

import HomeStack from './HomeStack';
import CustomSidebar from '../components/CustomSidebar';

const MainDrawer = props => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={{flex: 1}}>
      <HomeStack
        reload={props.reload}
        handleToken={props.handleToken}
        categories={props.categories}
        addCategory={props.addCategory}
        updateCategory={props.updateCategory}
        deleteCategory={props.deleteCategory}
        addTransaction={props.addTransaction}
        deleteTransaction={props.deleteTransaction}
        updateTransaction={props.updateTransaction}
        openSidebar={() => setSidebarVisible(true)}
      />

      {sidebarVisible && (
        <CustomSidebar
          closeSidebar={() => setSidebarVisible(false)}
          handleToken={props.handleToken}
        />
      )}
    </View>
  );
};

export default MainDrawer;