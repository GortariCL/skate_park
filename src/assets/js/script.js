//FUNCION PARA LIMPIAR FORMULARIO
const limpiarForm = (async () => {
    const { data } = await axios.get("http://localhost:3000/skaters");
    if (data.length > 0) {
        $('.tabla_skaters').html("");
    }
})();
//FUNCION CAMBIO STATUS
const statusSkater = (() => {
    let statusCheck = document.querySelectorAll('.status-checkbox');

    for (tagSkater of statusCheck) {
        tagSkater.addEventListener('click', async (e) => {
            try {
                const estado = e.target.checked;
                const id = e.target.name;
                await axios.put('/skater', {
                    id,
                    estado
                });
                alert(estado ? 'Skater aprobado' : 'Skater en revisión');
            } catch (err) {
                console.log(err);
            }
        });
    }
})();
//FUNCION VERIFICACION LOGIN SKATER
$('#lgnBtn').click(async (e) => {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();
    const payload = { email, password };
    try {
        const { data: token } = await axios.post('/verify', payload);
        alert('Autenticación exitosa!');
        window.location.href = `/datos?token=${token}`;
    } catch ({ response }) {
        const { data } = response;
        const { error } = data;
        alert(error);
    }
});
//FUNCION VERIFICACION LOGIN ADMIN
$('#lgnAdmin').click(async (e) => {
    e.preventDefault();
    const user = $('#user').val();
    const password = $('#password').val();
    const payload = { user, password };
    console.log(payload)
    try {
        const { data: token } = await axios.post('/verify-admin', payload);
        alert('Autenticación exitosa!');
        window.location.href = `/panel-admin?token=${token}`;
    } catch ({ response }) {
        const { data } = response;
        const { error } = data;
        alert(error);
    }
});
//FUNCION ACTUALIZAR SKATER
$('#btnActualizar').click(async (e) => {
    e.preventDefault();
    const id = $('#idSkater').val();
    const nombre = $('#nombre').val();
    const password = $('#password').val();
    const passConfirm = $('#passConfirm').val();
    const anos_experiencia = $('#anos_experiencia').val();
    const especialidad = $('#especialidad').val();
    if (password !== passConfirm) {
        alert('Passwords no coinciden');
        return false;
    }
    try {
        const { data } = await axios.put('/datos', {
            id,
            nombre,
            password,
            anos_experiencia,
            especialidad
        });
        alert('Actualización exitosa');
        window.location.href = '/';

    } catch (err) {
        alert('Error: ', err);
    }
});
//FUNCION ELIMINAR SKATER
$('#btnEliminar').click(async (e) => {
    e.preventDefault();
    const id = $('#idSkater').val();
    const foto = $('#fotoSkater').val();
    try {
        const { data } = await axios.delete(`/datos?id=${id}&foto=${foto}`);
        if(data){
            alert('Skater eliminado con éxito');
            window.location.href = '/';
        }
    } catch (err) {
        alert('Error: ', err);
    }
});
