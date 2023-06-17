<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const userPanelData = reactive({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    projects: []
});

const router = useRouter();
const isAuthenticated = ref(false);
const showModal = ref(false);
const isLoadingProjects = ref(true);

onMounted(async () => {
    const token = Cookies.get('token');
    if (token) {
        await checkAuthentication(token);

        if (isAuthenticated.value) {
            await fetchProjects(token);
        }
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

const fetchProjects = async (token) => {
    try {
        const response = await fetch('http://vps-3258627-x.dattaweb.com:8086/api/projects', {
            headers: {
                Authorization: token
            }
        });

        if (response.ok) {
            const projectsData = await response.json();
            userPanelData.projects = projectsData;
        } else {
            console.log('Error en la solicitud');
        }
    } catch (error) {
        console.error(error);
    } finally {
        isLoadingProjects.value = false;
    }
};

const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
};

const createProject = async () => {
    try {
        const form = document.forms.addProject;
        const token = Cookies.get('token');

        const response = await fetch('http://vps-3258627-x.dattaweb.com:8086/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({
                name: form.name.value,
                description: form.description.value
            })
        });

        if (response.ok) {
            console.log('Proyecto creado correctamente');

            showModal.value = false;

            const newProject = await response.json();

            userPanelData.projects.push(newProject);
        } else {
            console.log('Error al crear el proyecto');
        }
    } catch (error) {
        console.error(error);
    }
};

const goToProjectTaskBoard = (projectId) => {
    router.push({
  name: 'taskBoard',
  params: {
    id: projectId
  }
});
    console.log("El id del proyecto es: ", projectId);
};
</script>

<template>
    <nav v-if="isAuthenticated">
        <h2>Bienvenido, {{ userPanelData.user.name }}</h2>
        <button @click="handleLogout">Salir</button>
    </nav>
    <main v-if="isAuthenticated">
        <h1>Tableros</h1>

    <section class="boards">
      <section class="modal" v-if="showModal">
        <form name="addProject" @submit.prevent="createProject">
          <h3>Nuevo tablero</h3>
          <fieldset>
            <input type="text" name="name" placeholder="nombre">
            <input type="text" name="description" placeholder="descripción">
          </fieldset>
          <fieldset>
            <input type="submit" value="Añadir">
            <input type="button" value="cerrar" @click="showModal = false">
          </fieldset>
        </form>
      </section>

      <section class="board add" @click="showModal = true">
        <p>+</p>
        <p>Añadir un nuevo tablero</p>
      </section>
      <section v-if="isLoadingProjects">
        <p>Cargando tableros...</p>
      </section>

      <section class="board"
        v-for="project in userPanelData.projects"
        :key="project._id"
        @click="goToProjectTaskBoard(project._id)">
            <h2 class="title">{{ project.name }}</h2>
            <p>{{ project.description }}</p>
      </section>
    </section>
  </main>

  <div class="loading" v-if="userPanelData.isLoading">
    <p>Cargando...</p>
  </div>
</template>

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

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

main {
    padding: 1rem 5rem;
}

h2.title {
    font-size: 0.8rem;
    margin: 0;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
}

section.boards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}

section.board {
    font-weight: 400;
    height: 80px;
    width: 200px;
    background: var(--color-background-soft);
    border-radius: 5px;
    padding: 1rem;
    cursor: pointer;
    color: var(--color-text);
}

section.board.add {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: var(--color-heading);
}

section.board:hover {
    background: var(--color-background-mute);
}

section.modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: var(--color-background-mute);
    display: flex;
    justify-content: center;
    align-items: center;
    animation: modal 0.3s ease-in-out;
}

section.modal form {
    background-color: var(--color-background-soft);
    padding: 2rem;
    border-radius: 5px;
    width: 50%;
    border: solid 1px var(--color-border);
    box-shadow: var(--color-background-mute) 0px 0px 2px 1px;
}

section.modal form h3 {
    margin: 0;
    margin-bottom: 1rem;
}

section.modal form fieldset {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
    border: none;
}

section.modal form fieldset input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 5px;
    border: none;
    border: 1px solid var(--color-border);
}

@keyframes modal {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
