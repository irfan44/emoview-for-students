import * as faceapi from 'face-api.js'
import { io } from 'socket.io-client'
import axios from 'axios'
import { BE_ENDPOINT } from '../constants'

const modelUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
const baseUrl = BE_ENDPOINT

let video, canvas, ctx, canvas2
let isBusy = false

const init = async () => {
  const state = await chrome.storage.sync.get()
  await chrome.storage.sync.set({
    isStart: state.isStart ?? false,
    user: state.user || {},
    meetingCode: state.meetingCode || null
  })
  chrome.storage.sync.get().then((result) => {
    console.log('FER:: Chrome storage', result)
  })

  initSocketIo()

  await Promise.all([
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const div = document.createElement('div')
      video = document.createElement('video')
      canvas = document.createElement('canvas')
      ctx = canvas.getContext('2d')
      canvas2 = document.createElement('canvas')
      div.style.position = 'relative'
      div.style.width = '1px'
      div.style.zIndex = 99
      canvas.style.position = canvas2.style.position = 'absolute'
      canvas.style.top = canvas.style.left = canvas2.style.top = canvas2.style.left = 0
      canvas.width = canvas.height = video.width = video.height = 180
      canvas.style.visibility = 'hidden'
      video.autoplay = true
      video.srcObject = stream
      document.body.appendChild(div)
      div.appendChild(video)
      div.appendChild(canvas)
      div.appendChild(canvas2)
    }),
    faceapi.loadTinyFaceDetectorModel(modelUrl),
    faceapi.loadFaceExpressionModel(modelUrl),
  ])
}

const initSocketIo = async () => {
  const state = await chrome.storage.sync.get()
  const emoviewCode = state.meetingCode;

  const socket = io(`${baseUrl}`)
  socket.on('connect', () => {
    socket.emit('join', `student-${emoviewCode}`)
  })

  axios.patch(
    `${baseUrl}/meeting/add-participant/${emoviewCode}`,
    {
      userId: state.user.userId,
      fullname: state.user.fullname,
      email: state.user.email,
      picture: state.user.picture,
    },
    {
      headers: {
        Authorization: state.user.token,
      },
    },
  )

  socket.on('RECOGNITION_STATUS', async (status) => {
    if (status === 'started') {
      predict(status)
    }
  })
}

const predict = async (status) => {
  const state = await chrome.storage.sync.get()
  const emoviewCode = state.meetingCode;
  if (state.isStart) {
    isBusy = true
    const faceApiResult = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions()
    console.log(`FER Result :: ${faceApiResult}`)
    if (!faceApiResult.length) {
      console.log('FER:: Face not detected')
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      faceapi.matchDimensions(canvas2, video)
      const resizedResults = faceapi.resizeResults(faceApiResult, video)
      const minConfidence = 0.05
      faceapi.draw.drawDetections(canvas2, resizedResults)
      faceapi.draw.drawFaceExpressions(canvas2, resizedResults, minConfidence)
      const headers = {
        headers: {
          Authorization: state.user.token,
        },
      }
      let body
      const beURL = `${BE_ENDPOINT}/recognition`
      body = {
        ...parseProbability(faceApiResult[0].expressions),
        predict: getExpression(faceApiResult[0].expressions),
        emoviewCode: emoviewCode,
        meetCode: meetCode,
        image: canvas.toDataURL('image/jpeg'),
        status: status,
      }
      axios
        .post(beURL, body, headers)
        .then(({ data }) => {
          console.log('FER:: Success!', data)
        })
        .catch((err) => {
          console.log('FER:: Error', err)
        })
        .finally(() => {
          isBusy = false
        })
    }
  }
}

const getExpression = (expressions) => {
  const maxValue = Math.max(...Object.values(expressions))
  return Object.keys(expressions).find((expression) => expressions[expression] === maxValue)
}

const parseProbability = (probability) => {
  return Object.assign(
    ...Object.entries(probability).map((item) => ({
      [item[0]]: Number(item[1].toFixed(2)),
    })),
  )
}

// const emoviewCode = localStorage.getItem('emoviewCode');

const meetCode = location.pathname.includes('_')
  ? location.pathname.substring(7)
  : location.pathname.substring(1);

init()
