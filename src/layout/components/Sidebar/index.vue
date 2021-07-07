<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="false" />
    <el-divider style="width:215px" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-openeds="open_list"
        :default-active="$route.path"
        :collapse="false"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in permission_routes"
          :key="route.code"
          :item="route"
          :base-path="route.path"
          :index="index"
        />
      </el-menu>
    </el-scrollbar>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatarUrl" class="user-avatar" :class="{'collapse':isCollapse}">
          <span class="login-name">{{ username }}<i class="el-icon-caret-bottom" /></span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>主页</el-dropdown-item>
          </router-link> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <div class="logout" @click="logout">
        <span>退出登录</span>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import store from '../../../store'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      open_list: ['/dashboard'],
      roleCode: '',
      username: localStorage.getItem('username')
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    avatarUrl() {
      return require(`../../../assets/images/test2.png`)
    }
  },
  mounted() {
    console.log(this.permission_routes)
  },
  methods: {
    logout() {
      this.$confirm('此操作将登出系统, 是否继续?', '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-custom-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logoutUser()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消登出'
        })
      })
    },
    async logoutUser() {
      await this.$store.dispatch('Logout')
      this.$router.push(`/login`) // redirect=${this.$route.fullPath}
      store.dispatch('resetMapRouter')
      history.go(0)
    }
  }
}
</script>
<style lang="scss" scoped>
.logout {
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  border-radius: 6px;
  width: 84px;
  height: 32px;
  text-align: center;
  cursor: pointer;
  span {
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #ffffff;
    line-height: 32px;
  }
}
.right-menu {
  position: absolute;
  bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 30px;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;
      display: flex;

      .user-avatar {
        cursor: pointer;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        transition: all 0.5s;
        &:hover {
          transform: rotate(180deg);
        }
      }
      .user-avatar.collapse {
        width: 40px;
        height: 40px;
        margin-left: 6px;
      }

      .login-name{
        display: inline-block;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #FF5338;
        font-weight: 400;
        margin-left: 12px;
        line-height: 32px;
        i{
          line-height: 32px;
        }
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        bottom: 3px;
        font-size: 12px;
      }
    }
  }
}
</style>
