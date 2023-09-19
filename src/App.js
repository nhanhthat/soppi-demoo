import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';


function App() {
  const [link, setLink] = useState()
  const [isComplete, setIsComplete] = useState(false)
  const [isRun, setIsRun] = useState(false)
  const [reload, setReload] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      axios.get('http://localhost:5555/get-length')
      .then (res => {
        if (res.data.number != 0) {
          console.log('ducdeptrai')
          setIsRun(!isRun)
        } else {
          console.log('duc')
          setReload(!reload)
        }
      })
    }, 500)
    
  }, [reload])
  
  useEffect(() => {
    axios.get('http://localhost:5555/get-links')
      .then (res => {
        if (res.data.length != 0) {
          let num = res.data[0].queue
          res.data.forEach ((link) => {
              if (link.queue < num) {
                  num = link.queue
              }
          })  
          res.data.forEach((link, index) => {
            if (link.queue == num) {
              setLink(res.data[index])
            }
          })
        }
        
      })
  }, [isComplete, isRun])

  useEffect(() => {
    if (link != undefined) {
      axios.post('http://localhost:5555/api/live_x', {link : link.content})
        .then (res => {
          let result = res.data.success
          if (result == true) {
            axios.post('http://localhost:5555/update-status', {queue : link.queue, status : 'success'})
              .then(() => {
                axios.get('http://localhost:5555/get-link-by-queue?queue='+ link.queue)
                  .then(res => {
                    if (res.data.length != 1) {
                      setReload(!reload)
                      window.location.reload()
                    }
                  })
              })
          } else {
            axios.post('http://localhost:5555/update-status', {queue : link.queue, status : 'fail'})
              .then(() => {
                axios.get('http://localhost:5555/get-link-by-queue?queue='+ link.queue)
                  .then(res => {
                    if (res.data.length != 1) {
                      setReload(!reload)
                      window.location.reload()
                    }
                  })
              })
          }
        })
    }
  }, [link])

  return (
    <div className="App">
    </div>
  );
}

export default App;
