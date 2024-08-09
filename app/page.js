'use client'
// import {Box, Button, Stack, TextField} from "@mui/material"
import {Box, Button, Stack, TextField, createTheme, ThemeProvider, CssBaseline, Switch, Typography} from "@mui/material"
// import { Content } from "next/font/google";
// import Image from "next/image";
import {useState, useEffect, useRef} from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([
    {
    role: 'assistant',
    content: `Hi I'm the Headstarter Support Agent, how can I assist you today?` 
    },
  ])

  const [message, setMessage] = useState('')

  const sendMessage = async()=>{
    setMessage('')
    setMessages((messages)=>[
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content:""}
    ])
    const response = fetch('/chat', {
      method: "POST",
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify([...messages,{role: 'user', content: message}])
    }).then(async(res)=>{
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function ProcessText({done, value}){
        if (done){
          return result

        }
        const text = decoder.decode(value || new Int8Array(), {stream: true})
        setMessages((messages)=>{
          let lastMessage = messages[messages.length-1]
          let otherMessages = messages.slice(0, messages.length-1)
          return[
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text
            }
          ]
        })
        return reader.read().then(ProcessText)
      })

    })
  }

  // // Function to scroll to the bottom of the messages container
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  // }

  // useEffect (() => {
  //   scrollToBottom();
  // }, [messages])

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1E88E5',
      },
      secondary: {
        main: '#FB8C00',
      },
    },
    
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#CE93D8',
      },
      secondary: {
        main: '#80CBC4',
      },
    },
    
  });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
    <CssBaseline />
    <Box
      width={"100vw"}
      height={"50vw"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Typography variant="h2" marginTop={3}>AI Chatbot</Typography>
      <Stack
      marginTop={2}
       direction={"column"}
       width={'600px'}
       height={'700px'}
       border={'5px solid '}
       borderColor={darkMode ? 'white' : 'black'}
       borderRadius={"25px"}
       p={2}
       spacing={2}
      >
        <Box>
        <Switch checked={darkMode} onChange={handleToggle}></Switch>
        {darkMode ? "Dark mode" : "Light mode"}
        </Box>
        
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow={'auto'}
          maxHeight={'100vw'}
        >
          {
            messages.map((message, index)=> (
              <Box key={index}
                display={'flex'}
                justifyContent={
                  message.role=== 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant' 
                      ? 'primary.main'
                      : 'secondary.main'
                  }
                  color={'white'}
                  borderRadius={16}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack 
          direction={'row'}
          spacing={2}>
          
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
            >Send</Button>
        </Stack>
      </Stack>
    </Box>
    </ThemeProvider>
  )
}
