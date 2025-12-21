<script>
let data=JSON.parse(localStorage.getItem("financeLive"))||[];
let barChart,donutChart;

function addData(){
    let amt=Number(amount.value);
    if(!amt) return alert("Enter amount");
    data.push({
        amount:amt,
        type:type.value,
        category:category.value,
        month:month.value,
        year:year.value
    });
    localStorage.setItem("financeLive",JSON.stringify(data));
    amount.value="";
    render();
}

function render(){
    let inc=0,exp=0,cats={};
    list.innerHTML="";
    data.filter(d=>d.month==month.value && d.year==year.value)
    .forEach(d=>{
        list.innerHTML+=`
        <tr>
        <td>${d.category}</td>
        <td class="${d.type}">${d.type}</td>
        <td>₹ ${d.amount}</td>
        </tr>`;
        d.type=="income"?inc+=d.amount:exp+=d.amount;
        if(d.type=="expense")
            cats[d.category]=(cats[d.category]||0)+d.amount;
    });

    income.textContent=inc;
    expense.textContent=exp;
    balance.textContent=inc-exp;
    rate.textContent=inc?(((inc-exp)/inc)*100).toFixed(1):0;
    drawCharts(inc,exp,cats);
}

function drawCharts(inc,exp,cats){
    if(barChart) barChart.destroy();
    if(donutChart) donutChart.destroy();

    barChart=new Chart(barChartCanvas,{
        type:"bar",
        data:{
            labels:["Income","Expense"],
            datasets:[{
                data:[inc,exp],
                backgroundColor:["#2ecc71","#e74c3c"]
            }]
        }
    });

    donutChart=new Chart(donutChartCanvas,{
        type:"doughnut",
        data:{
            labels:Object.keys(cats),
            datasets:[{
                data:Object.values(cats),
                backgroundColor:["#ff6384","#36a2eb","#ffcd56","#4bc0c0","#9966ff"]
            }]
        }
    });
}

month.value=new Date().getMonth();
const barChartCanvas=document.getElementById("barChart");
const donutChartCanvas=document.getElementById("donutChart");
render();
</script>