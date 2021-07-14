<template>
  <!-- :class="{ collapse: collapse }" -->
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <div v-if="logo" class=" bg-logo " />
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo"> -->
        <div v-if="logo" class=" bg-logo " />
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '后台模板',
      logo: '' // require('@/assets/images/HomeLogo.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
  overflow: hidden;
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
      & .bg-logo{
      width: 166px;
      height: 80px;
      background-image: url('../../../assets/images/logoIndex.png');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      text-align: center;
      margin-left: 20px;
      margin-top: 16px;
    }
    & .sidebar-logo {
      height: 40px;
      width: 155px;
      margin-top: 32px;
    }
    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 30px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}

</style>
