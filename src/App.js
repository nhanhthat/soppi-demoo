import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';


function App() {
  const [link, setLink] = useState()
  const [linkBackup, setLinkBackup] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [isRun, setIsRun] = useState(false)
  const [reload, setReload] = useState(false)
  const [delete1, setDelete1s] = useState(false)
  useEffect(() => {
    let int = setTimeout (() => {
      axios.get('http://localhost:5555/get-length')
        .then (res => {
          if (res.data.number != 0) {
            console.log('duc')
            setIsRun(!isRun)
          } else {
            console.log('duc dep trai')
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
              setLinkBackup(link)
              setLink(res.data[index])
            }
          })
        }
      })
  }, [isComplete, isRun])

  useEffect(() => {
    setTimeout(() => {
      if (link != undefined ) {
        axios.post('http://localhost:5555/api/live_x', {link : link.content})
          .then (res => {
            let result = res.data.success
            if (result == true) {
              axios.post('http://localhost:5555/update-status', {queue : link.queue, status : 'success'})
                .then(() => {
                  setTimeout(() => {
                        setDelete1s(!delete1)
                  }, 2000)
                })
            } else {
              axios.post('http://localhost:5555/update-status', {queue : link.queue, status : 'fail'})
                .then(() => {
                  setTimeout(() => {
                        setDelete1s(!delete1)
                  }, 2000)
                })
            }
          })
      }
    }, 300)
  }, [link])

  useEffect( () => {
    if (link != undefined ) {
      let haha = setInterval(() => {
        axios.get('http://localhost:5555/get-link-by-queue?queue='+ link.queue)
        .then(res => {
          console.log(res.data)
          if(res.data.status == 200){
            if (res.data.delete == true) {
              setTimeout(() => {
                axios.post('http://localhost:5555/delete', {queue : link.queue})
                .then(res => {
                  setReload(!reload)
                  window.location.reload()
                  clearInterval(haha)
                })
              }, 30000)
            }
          }
        })
      }, 100)
    }

  }, [delete1])

  return (
    <div className="App">
    </div>
  );
}

export default App;

