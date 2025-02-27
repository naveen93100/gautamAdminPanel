// MyContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const Context = createContext();

export const ContextAPI = () => {
  return useContext(Context);
};

export const ContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [tags, setTags] = useState([]);
  const [login, setLogin] = useState(false);
  const toast = useToast();

  useEffect(() => {

    if (localStorage.getItem('Login') != 'True') {
      setLogin(false); // If Admin already logged in, set login state to true (refresh the page not be show the loginpage)
    } else {
      setLogin(true);
    }
    DataHandler();
    localStorage.setItem('Page', '1');
  }, []);

  const DataHandler = async (Param) => {

    if (!Param) {
      console.log('ok')
      try {
        let { data } = await axios.get('https://gautamsolar.us/admin/news?NoOfNews=5&Page=1');
        // let { data } = await axios.get('http://localhost:1008/admin/news?NoOfNews=5&Page=1');
        console.log(data.data)
        setData(data.data);
      } catch (err) {
        setData([]);
        toast({
          title: 'OOps !',
          description: "We have no data",
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    }
    else {
      setData(Param);
    }
  };

  return (
    <Context.Provider value={{ DataHandler, setData, data, login, setLogin, tags, setTags }}>
      {children}
    </Context.Provider>
  );
};
