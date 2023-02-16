<template>
  <div class="app-container">
    <!-- 工具按钮 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin: 5px">用户查询</span>
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
    </el-card>
    <!--查询表单-->
    <el-card class="operate-container" shadow="never">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="searchObj.username" placeholder="用户名" />
        </el-form-item>

        <!--
        <el-form-item label="用户编号">
          <el-select v-model="searchObj.id" clearable placeholder="头衔">
            <el-option value="1" label="高级讲师" />
            <el-option value="0" label="首席讲师" />
          </el-select>
        </el-form-item>      -->

        <el-form-item label="用户编号">
          <el-input v-model="searchObj.id" placeholder="用户编号" />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="searchObj.phone" placeholder="手机号" />
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchObj.createTime"
            placeholder="创建时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <!--        <el-form-item label="-">
          <el-date-picker
            v-model="searchObj.joinDateEnd"
            placeholder="结束时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>-->

        <!--     <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>-->
      </el-form>
    </el-card>

    <!-- 工具按钮 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px" />
      <span style="margin: 5px">数据列表</span>
      <el-button class="btn-add" style="margin-left: 10px;" @click="add()">添加</el-button>
      <el-button class="btn-add" @click="batchRemove()">批量删除</el-button>
    </el-card>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column
        label="序号"
        width="50"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column v-if="false" prop="id" label="用户id" width="80" />
      <el-table-column prop="username" label="用户昵称" width="80" />
      <el-table-column label="用户头像" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.avatarUrl"
          />
        </template>
      </el-table-column>
      <el-table-column label="性别" width="60">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.gender === 1" type="success" size="mini">男</el-tag>
          <el-tag v-if="scope.row.gender === 0" size="mini">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="120" />
      <el-table-column prop="planetCode" label="星球编号" width="120" />
      <el-table-column prop="email" label="邮箱" width="240" />
      <!--    todo 可以在前端转时间utils-->
      <el-table-column prop="createTime" label="创建时间" width="160" />

      <!-- // todo 表单筛选优化 https://www.jianshu.com/p/2dae1282df99-->
      <el-table-column
        label="用户角色"
        width="90"
        align="center"
        prop="userRole"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.userRole === 1" type="success" size="mini">管理员</el-tag>
          <el-tag v-if="scope.row.userRole === 0" size="mini">普通用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="'/vod/teacher/edit/'+scope.row.id">
            <el-button size="mini">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="removeById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
    />

  </div>
</template>

<script>
// 引入定义接口js文件
import userApi from '@/api/user'
// import formatTime from '@/utils/index'

export default {
  data() { // 初始值
    return {
      list: [], // 讲师列表
      total: 0, // 总记录数
      page: 1, // 当前页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询条件
      multipleSelection: []// 批量删除选中的记录列表
    }
  },
  created() { // 页面渲染之前
    this.fetchData()
  },
  methods: { // 具体方法
    // 批量删除
    batchRemove() {
      // 判断非空
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var idList = []
        // [1,2,3]
        // 遍历数组
        for (var i = 0; i < this.multipleSelection.length; i++) {
          var obj = this.multipleSelection[i]
          var id = obj.id
          // 放到数组
          idList.push(id)
        }
        // 调用接口删除
        userApi.batchRemove(idList)
          .then(response => {
            // 提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新
            this.fetchData()
          })
      }).catch(() => {})
    },
    // 复选框发生变化，调用方法，选中复选框行内容传递
    handleSelectionChange(selection) {
      this.multipleSelection = selection
      // console.log(`multipleSelection==${JSON.stringify(this.multipleSelection)}`)
    },
    // 跳转到添加表单页面
    add() {
      this.$router.push({ path: '/user/create' })
    },
    fetchData() {
      // ajax
      userApi.userPageList(this.page, this.limit, this.searchObj)
        .then(response => {
          this.list = response.data.records
          this.total = response.data.total
        })
    },
    // 改变每页显示记录数
    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },
    // 改变页码数
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },
    // 清空
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    // 讲师删除
    removeById(id) {
      this.$confirm('此操作将删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用接口删除
        userApi.removeUserId(id)
          .then(response => {
            // 提示
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新
            this.fetchData()
          })
      }).catch(() => {})
    }
  }
}
</script>
