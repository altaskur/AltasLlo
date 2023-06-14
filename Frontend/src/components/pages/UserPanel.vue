<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const userPanelData = reactive({
  isAuthenticated: false,
  isLoading: true,
  user: null
});

const router = useRouter();
const isAuthenticated = ref(false);

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
        Authorization: token
      }
    });

    if (response.ok) {
      const responseData = await response.json();
      userPanelData.user = responseData;
      isAuthenticated.value = true;
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

const handleLogout = () => {
  Cookies.remove('token');
  router.push('/');
};
</script>

<template>
  <div v-if="isAuthenticated">
    <h2>Welcome, {{ userPanelData.user.name }}</h2>
    <!-- Otros detalles del usuario -->
    <button @click="handleLogout">Salir</button>
  </div>
  <div v-if="userPanelData.isLoading">
    <p>Cargando...</p>
  </div>
</template>
