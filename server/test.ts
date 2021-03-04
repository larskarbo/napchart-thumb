
fetch("http://localhost:1771/api/create", {
	method: "POST",
	body: JSON.stringify({data: '{\"chartData\":{\"elements\":[{\"start\":180,\"end\":300,\"id\":0,\"lane\":0,\"text\":\"\",\"color\":\"red\"},{\"start\":480,\"end\":500,\"id\":1,\"lane\":0,\"text\":\"\",\"color\":\"red\"},{\"start\":840,\"end\":860,\"id\":2,\"lane\":0,\"text\":\"\",\"color\":\"red\"},{\"start\":1260,\"end\":1380,\"id\":3,\"lane\":0,\"text\":\"\",\"color\":\"red\"}],\"shape\":\"circle\",\"lanes\":1},\"metaInfo\":{\"title\":\"\",\"description\":\"\"}}'}),
	headers: {
    'Content-Type': 'application/json' // IMPORTANT
  },
}).then(r => r.json()).then(a => console.log(a))
	.catch(a => console.error("error: ", a))