<template>
  <div class="explain-container">
    <h1>系统操作说明书</h1>
    <pre class="content">
      软件的使用文档分为两种常见的写法，一种是俗称“点点点”的帮助手册类使用文档，告知用户每一步需要点击的按钮，用系统的截图及指示去展现；另一种是偏需求文档的形式，告知用户为什么这样操作，怎么操作。下面具体分析两种写法风格的场景选择及写发分析。

      一.帮助手册类使用文档
      此类使用文档多用于业务逻辑简单的系统，大多数的逻辑在页面上可以展示，用户只需要知道系统的使用流程，在哪些模块实现哪些操作即可。用系统截图+箭头/符号的视觉指引来引导点击区域，附带着一些注意事项类的文字，基本可说明使用情况。具体的内容划分如下：
      1.功能模块的划分
      2.系统截图
      3.操作步骤
      4.注意事项
      5.需求类使用文档
      此类使用文档多用于复杂逻辑的系统，很多隐藏的逻辑在页面上无法看出，很多后台设定的流程或逻辑，需要文档中说明；另一种情况是针对于强业务系统，尤其B端的系统居多，业务逻辑很多，需要以此文档给使用者讲清楚业务逻辑后，再加入“点点点”的操作。具体内容划分如下：
      1.部分业务流程讲解
      2.系统截图
      3.功能模块的划分
      4.操作步骤
      5.注意事项
      使用文档一般按照用户角色区分，每一种用户都有一份使用文档，常见的系统有前端，后台两个大块，即分为后台管理员使用说明书和用户使用说明书，如系统较大，比如OA系统，后台可以继续拆分，如财务人员使用说明书，crm管理员使用说明书，业务管理员使用说明书等等。

      二.文档书写格式
      正规的文档的格式，可以按以下的结构去写，主要包括：文档控制部分、前言、使用说明和注意事项。详细说明分别如下：

      三.文档控制部分
      这部分主要说明文档的更新迭代及编辑情况，便于文档的管理，也给阅读的人清晰的版本说明。此部分主要包含以下几点：
      标题、版本号、修改记录
    </pre>
    <!-- <div class="content">
      <p />
    </div> -->
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
  .explain-container{
    background: #FFF;
    height: calc(100vh - 60px);
    padding: 32px;
    margin: 20px 0;
    box-shadow: 2px 2px 12px 4px rgba(130, 80, 66, 0.08);
    border-radius: 8px;
    overflow-y: auto;
    h1 {
      font-size: 18px;
      text-align: center;
      margin: 0;
      color: #393F4E;
      margin-bottom: 26px;
    }
    .content {
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 16px;
      white-space: break-spaces;
      font-weight: 400;
      color: #393F4E;
      line-height: 32px;
    }
  }
</style>
