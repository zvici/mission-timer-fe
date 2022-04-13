<template>
  <div class="app-calendar overflow-hidden border">
    <b-overlay
      :show="isLoading"
      spinner-variant="primary"
      spinner-type="grow"
      spinner-small
      rounded="sm"
    >
      <div class="row no-gutters">
        <!-- Sidebar -->
        <div
          class="col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column"
          :class="{ show: isCalendarOverlaySidebarActive }"
        >
          <calendar-sidebar
            :is-event-handler-sidebar-active.sync="isEventHandlerSidebarActive"
          />
        </div>

        <!-- Calendar -->
        <div class="col position-relative">
          <div class="card shadow-none border-0 mb-0 rounded-0">
            <div class="card-body pb-0">
              <full-calendar
                ref="refCalendar"
                :options="calendarOptions"
                class="full-calendar"
              />
            </div>
          </div>
        </div>

        <!-- Sidebar Overlay -->
        <div
          class="body-content-overlay"
          :class="{ show: isCalendarOverlaySidebarActive }"
          @click="isCalendarOverlaySidebarActive = false"
        />
        <calendar-event-handler
          v-model="isEventHandlerSidebarActive"
          :event="event"
          :clear-event-data="clearEventData"
          @remove-event="removeEvent"
          @add-event="addEvent"
          @update-event="updateEvent"
        />
      </div>
    </b-overlay>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import { onUnmounted } from '@vue/composition-api'
import { BOverlay } from 'bootstrap-vue'
import store from '@/store'
import calendarStoreModule from './calendarStoreModule'
import CalendarSidebar from './calendar-sidebar/CalendarSidebar.vue'
import CalendarEventHandler from './calendar-event-handler/CalendarEventHandler.vue'
import useCalendar from './useCalendar'

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    CalendarSidebar,
    CalendarEventHandler,
    BOverlay,
  },
  setup() {
    const CALENDAR_APP_STORE_MODULE_NAME = 'calendar'

    // Register module
    if (!store.hasModule(CALENDAR_APP_STORE_MODULE_NAME)) store.registerModule(CALENDAR_APP_STORE_MODULE_NAME, calendarStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CALENDAR_APP_STORE_MODULE_NAME)) store.unregisterModule(CALENDAR_APP_STORE_MODULE_NAME)
    })

    const {
      refCalendar,
      isCalendarOverlaySidebarActive,
      event,
      clearEventData,
      addEvent,
      updateEvent,
      removeEvent,
      fetchEvents,
      refetchEvents,
      calendarOptions,

      // ----- UI ----- //
      isEventHandlerSidebarActive,
      isLoading,
    } = useCalendar()

    fetchEvents()

    return {
      refCalendar,
      isCalendarOverlaySidebarActive,
      event,
      clearEventData,
      addEvent,
      updateEvent,
      removeEvent,
      refetchEvents,
      calendarOptions,

      // ----- UI ----- //
      isLoading,
      isEventHandlerSidebarActive,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/apps/calendar.scss';
</style>
