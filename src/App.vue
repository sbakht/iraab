<template>
  <div class="max-w-screen-lg m-auto">
    <div id="nav" class="text-center">
      <router-link to="/">Home</router-link> |
      <router-link to="/graph">Dependency Graph</router-link> |
      <router-link to="/selectable">Selectable</router-link> |
      <router-link to="/create">Create</router-link> |
      <router-link to="/search">Search</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;
  padding-top: 0;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

@font-face {
  font-family: "uthmani-hafs";
  src: url("./assets/Uthmani-Hafs.woff2") format("woff2"),
    url("./assets/Uthmani-Hafs.woff") format("woff");
}

.arabic {
  font-family: "uthmani-hafs";
  color: #2c3e50;
}
</style>
