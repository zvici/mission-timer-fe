<template>
  <div>
    <input
      id="file-input"
      type="file"
      accept="image/*"
      @change="uploadImage($event)"
    >
  </div>
</template>
<script>
import axiosIns from '@/libs/axios'

export default {
  methods: {
    uploadImage(event) {
      const URL = 'https://mission-timer-be.herokuapp.com/api/user/avatar'
      const data = new FormData()
      data.append('name', 'my-picture')
      data.append('NAME', event.target.files[0])
      const config = {
        header: {
          'Content-Type': 'image/png',
        },
      }
      axiosIns.post(URL, data, config).then(response => {
        console.log('image upload response > ', response)
      })
    },
  },
}
</script>
