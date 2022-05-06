<template>
  <b-row class="match-height">
    <b-col md="12">
      <TableUsers />
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import TableUsers from './table/TableUsers.vue'

export default {
  components: {
    TableUsers,
    BRow,
    BCol,
  },
}
</script>
