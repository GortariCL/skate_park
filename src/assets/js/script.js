const getSkater = async () => {
    const { data } = await axios.get("http://localhost:3000/skater");
    console.log(data)
    if (data.length > 0) {
        $('.tabla_skaters').html("");
    }
};

getSkater();