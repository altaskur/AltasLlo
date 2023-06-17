<script setup>
import Logo from '@/assets/logo.svg';
import Cookies from 'js-cookie';
import { ref,onMounted  } from 'vue';
import { useRouter } from 'vue-router'; 

const error = ref(null);
const router = useRouter();
onMounted(() => {
  const token = Cookies.get('token');
  if (token) {
    router.push('/userPanel');
  }
});
const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  await fetchData(data);
};

const fetchData = async (formData) => {
  try {
    const response = await fetch('http://vps-3258627-x.dattaweb.com:8086/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const responseData = await response.json();
      const token = responseData.token;
      console.log("El token", token);
      const expires = 1;
      Cookies.set('token', token, { expires });
      router.push('/userPanel');
    } else {
      error.value = 'Error en la solicitud';
    }
  } catch (error) {
    console.error(error);
    error.value = 'Error en la solicitud';
  }
};
</script>


<template>
   <main>
      <section class="card">
         <section class="body">
         <figcaption class="logo">
            <img :src="Logo" alt="Logo">
            <h1>AltasLlo</h1>
         </figcaption>
         <form action="" method="post" @submit="handleSubmit">
            <p v-if="error" class="error-message">{{ error }}</p>
            <h2>Inicia sesión en AltasLlo</h2>
            <input type="email" name="email" id="username" placeholder="Nombre de usuario">
            <input type="password" name="password" id="password" placeholder="Contraseña">
            <button type="submit">Iniciar sesión</button>
         </form>

         </section>
         <section class="footer">
            <p>Altaskur</p>
            <p>Estudiante de DAW</p>
         </section>
      </section>
   </main>
</template>

<style scoped>
main {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: 100vh;
   width: 100vw;
}

section.card {

   display: grid;
   grid-template-rows: 4fr 1fr;
   grid-template-columns: 1fr;

   height: 449px;
   width: 400px;

   padding: 2rem 1rem;

   background-color: var(--color-background-soft);
   border-radius: 3px;
   box-shadow: var(--color-background-mute) 0px 0px 2px 1px;

}

section.card section.body {
   display: grid;
   grid-template-columns: 1fr 1fr;
   grid-template-rows: 1fr;
   align-items: center;
}

section.card section.body form {
   text-align: center;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 1rem;
}
section.body form input, section.body form button {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: none;
        border: 1px solid var(--color-border);
    }

section.card section.footer {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   gap: 0.5rem;
   border-radius: 0 0 3px 3px;
}
figcaption.logo{
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 1rem;
}
figcaption.logo img{
   height: 2rem;
   width: 2rem;
   fill: var(--color-heading);
   color: var(--color-heading);
}
.error-message {
  color: red;
  font-weight: bold;
  animation-name: error-animation;
  animation-duration: 1s;
}

@keyframes error-animation {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
