<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const taskBoardData = reactive({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  project: null,
  tasks: [],
});

const route = useRoute();
const router = useRouter();
const projectId = ref(route.params.id);
const isAuthenticated = ref(false);
const showModal = ref(false);
const selectedState = ref('');

const handleLogout = () => {
  Cookies.remove('token');
  router.push('/');
};

const handleTaskClick = (state) => {
  selectedState.value = state;
  showModal.value = true;
};

const getTasksByState = (status) => {
  if (taskBoardData.project && taskBoardData.tasks) {
    return taskBoardData.tasks.filter(task => task.status === status);
  } else {
    return [];
  }
};

const newTask = reactive({
    name: '',
    description: '',
  });

  const submitTask = async () => {
    const token = Cookies.get('token');

    try {
      const response = await fetch('http://vps-3258627-x.dattaweb.com:8086/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          title: newTask.name,
          description: newTask.description,
          color: "#000000",
          status: selectedState.value,
          tags: ["string"],
          project: projectId.value,
          user: taskBoardData.user.id,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Tarea creada:', responseData);
        taskBoardData.tasks.push(responseData);
        showModal.value = false;
      } else {
        console.error('Error al crear la tarea');
      }
    } catch (error) {
      console.error(error);
    }
  };

const fetchTasks = async (token, projectId) => {
  try {
    const response = await fetch(`http://vps-3258627-x.dattaweb.com:8086/api/tasks/${projectId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) {
      const responseData = await response.json();
        taskBoardData.tasks = responseData;
        console.log('Tareas:', responseData);
    } else {
      console.error('Error fetching tasks');
    }
  } catch (error) {
    console.error(error);
  }
};

const getProject = async (token, projectId) => {
  try {
    const response = await fetch(`http://vps-3258627-x.dattaweb.com:8086/api/projects/${projectId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) {
      taskBoardData.project = await response.json();
    } else {
      console.error('Error al obtener el proyecto');
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  const token = Cookies.get('token');
  if (token) {
    await checkAuthentication(token);

    if (isAuthenticated.value) {
      await getProject(token, projectId.value);
      await fetchTasks(token, projectId.value);
    }
  } else {
    router.push('/');
  }
});

const checkAuthentication = async (token) => {
  try {
    const response = await fetch('http://vps-3258627-x.dattaweb.com:8086/api/auth/me', {
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      taskBoardData.user = responseData;
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
    taskBoardData.isLoading = false;
  }
};

const confirmDeleteTask = (task) => {

  const confirmDelete = confirm(`¿Deseas eliminar la tarea "${task.title}"?`);
  if (confirmDelete) {
    deleteTask(task);
  }
};

const deleteTask = async (task) => {
  const token = Cookies.get('token');
  try {
    const response = await fetch(`http://vps-3258627-x.dattaweb.com:8086/api/tasks/${task._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) {
      console.log('Tarea eliminada:', task);
      const index = taskBoardData.tasks.findIndex((t) => t._id === task._id);
      if (index !== -1) {
        taskBoardData.tasks.splice(index, 1);
      }
    } else {
      console.error('Error al eliminar la tarea');
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
    <nav v-if="isAuthenticated">
      <h2>Bienvenido, {{ taskBoardData.user ? taskBoardData.user.name : 'Usuario' }}</h2>
      <button @click="handleLogout">Salir</button>
    </nav>
    
    <main v-if="isAuthenticated">
        <h1 v-if="taskBoardData.project">Proyecto, {{ taskBoardData.project.name }}</h1>
        <section class="tasks">
            <section class="modal" v-if="showModal">
        <form name="addProject"  @submit.prevent="submitTask">
          <h3>Nueva tarea en {{ selectedState }} </h3>
          <fieldset>
            <input type="text" name="name" placeholder="nombre" v-model="newTask.name">
            <input type="text" name="description" placeholder="descripción" v-model="newTask.description">
          </fieldset>
          <fieldset>
            <input type="submit" value="Añadir">
            <input type="button" value="cerrar" @click="showModal = false">
          </fieldset>
        </form>
      </section>
            <section class="todo">
                <h2>Por hacer</h2>
                <section class="task-container">
                    <section class="task add" @click="handleTaskClick('todo')">
                        <p>+</p>
                        <p>Añadir nueva tarea</p>
                    </section>
                     <section class="task" 
                        v-for="task in getTasksByState('todo')" 
                        :key="task.id" @click="confirmDeleteTask(task)">
                            <p>{{ task.name }}</p>
                            <p>{{ task.description }}</p>
                    </section>
                </section>
            </section>
            <section class="doing">
                <h2>En proceso</h2>
                <section class="task-container">
                    <section class="task add" @click="handleTaskClick('inProgress')">
                        <p>+</p>
                        <p>Añadir nueva tarea</p>
                    </section>

                    <section class="task" v-for="task in getTasksByState('inProgress')" :key="task.id" @click="confirmDeleteTask(task)">
                        <p>{{ task.name }}</p>
                        <p>{{ task.description }}</p>
                    </section>
                </section>
            </section>
            <section class="done">
                <h2>Hecho</h2>
                <section class="task-container">
                    <section class="task add" @click="handleTaskClick('done')">
                        <p>+</p>
                        <p>Añadir nueva tarea</p>
                    </section>
                    <section class="task" v-for="task in getTasksByState('done')" :key="task.id" @click="confirmDeleteTask(task)">
                        <p>{{ task.name }}</p>
                        <p>{{ task.description }}</p>
                    </section>
                </section>
            </section>
        </section>

    </main>
    <div class="loading" v-if="taskBoardData.isLoading">
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

main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 3rem 3rem;
  gap: 2rem;
}

main section.tasks {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
main section.tasks section.task-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    gap: 1rem;
}
section.task {
    font-weight: 400;
    height: 80px;
    width: 200px;
    background: var(--color-background-soft);
    border-radius: 5px;
    padding: 1rem;
    cursor: pointer;
    color: var(--color-text);
}

section.task.add {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: var(--color-heading);
}
section.task:hover {
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
