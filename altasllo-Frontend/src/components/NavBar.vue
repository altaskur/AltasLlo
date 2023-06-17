<template>
    <nav>
      <h2>Bienvenido, {{ userPanelData.user.name }}</h2>
      <button v-if="userPanelData.isAuthenticated" @click="handleLogout">Salir</button>
    </nav>
  </template>

  <script setup>
  import { onMounted, inject } from 'vue';
  import Cookies from 'js-cookie';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
  };

  const userPanelData = inject('userPanelData');

  onMounted(async () => {
    const token = Cookies.get('token');
    if (token) {
      await checkAuthentication(token);
    } else {
      router.push('/');
    }
  });

  const checkAuthentication = async (token) => {
    try {
      const response = await fetch('http://vps-3258627-x.dattaweb.com:8086/api/auth/me', {
        headers: {
          Authorization:token
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        userPanelData.user = responseData;
        userPanelData.isAuthenticated = true;
      } else {
        Cookies.remove('token');
        router.push('/');
      }
    } catch (error) {
      console.error(error);
      Cookies.remove('token');
      router.push('/');
    } finally {
      userPanelData.isLoading = false;
    }
  };
  </script>

  <style scoped>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: var(--color-background-mute);
  }

  nav button {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: none;
    border: 1px solid var(--color-border);
  }
  </style>
