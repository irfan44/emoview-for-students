<script setup>
</script>

<template>
  <main>
    <h3>Options Page!</h3>

    <h6>&copy; {{ new Date().getFullYear() }}, Derry Dwi Aditya</h6>
  </main>
</template>

<style>
main {
  text-align: center;
  padding: 1em;
  margin: 0 auto;
}

h3 {
  color: #2196f3;
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 200;
  line-height: 1.2rem;
  margin: 2rem auto;
}

h6 {
  font-size: 0.5rem;
  color: #999999;
  margin: 0.5rem;
}

a {
  font-size: 0.5rem;
  margin: 0.5rem;
  color: #cccccc;
  text-decoration: none;
}

@media (min-width: 480px) {
  h3 {
    max-width: none;
  }
}

@media (prefers-color-scheme: light) {
  a:hover {
    color: #747bff;
  }

  h6 {
    color: #333333;
  }
}
</style>
