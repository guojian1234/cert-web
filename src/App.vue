<!-- App.vue -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.top-nav h2 {
  font-size: 20px;
}

.top-nav a {
  text-decoration: none;
  color: #1890ff;
}
</style>