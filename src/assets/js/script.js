const getSkater = (async () => {
    const { data } = await axios.get("http://localhost:3000/skaters");
    if (data.length > 0) {
        $('.tabla_skaters').html("");
    }
})();

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
