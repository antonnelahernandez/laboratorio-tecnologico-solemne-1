import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"
import data from './data.json' with {type : 'json'}

const songStage = d3.group (data, d => d ["DABDA Stage"])

const hierarchyData = d3.hierarchy({
 name: "DABDA",
    children: Array.from(songStage, ([stage, songs]) => ({
        name: stage,
        children: songs.map(s => ({name: s.name}))
    }))
})

const counts = hierarchyData.children.map(d => ({
    stage: d.data.name,
    value: d.children.length
}))

const width= 450, height=450
const radius= Math.min(width, height) / 2

const svg = d3.select ("svg")
      .attr("width", width)
      .attr("height", height)
      .append ("g")
      .attr( 'transform', `translate (${width / 2}, ${height / 2})`)

const color = d3.scaleOrdinal(["#c88ec0","#e86b93","#88d0df"," #8bcbbb","#1d2647" ])

const pie = d3.pie().value((d) => d.value);
const arc = d3.arc()
    .innerRadius(60)
    .outerRadius(radius - 80)

const arcSongs = d3.arc()
    .innerRadius(75)
    .outerRadius(radius -10)

svg.selectAll ("path.stage")
   .data(pie(counts))
   .join("path")
   .attr("class", "stage")
   .attr("d", arc)
   .attr("fill", d=> color(d.data.stage))
   .attr("stroke", "#fff")
   .style("stroke-width", "2px")
    
 svg.selectAll("text.stage")
   .data(pie(counts))
   .join("text")
   .attr("class", "stage")
   .attr("text-anchor", "middle")
   .attr('transform', d=> `translate(${arc.centroid(d)})`)
   .attr("fill", "#fff")
   .text(d => d.data.stage)

svg.selectAll("g.songs")
   .data(pie(counts))
   .join("g")
   .attr("class", "songs")
   .each(function(d, i) {
        const stageNode = hierarchyData.children[i]
        const songs = stageNode.children || []
        const arcG = d3.select(this)
        const angleStep = (d.endAngle - d.startAngle) / songs.length

        songs.forEach((song, j) => {
            const angle = d.startAngle + angleStep * (j + 0.5)
            const [x, y] = arcSongs.centroid({startAngle: angle, endAngle: angle})

arcG.append("text")
   .attr("text-anchor", "start")
   .attr("alignment-baseline", "middle")
   .attr('transform', `translate(${x},${y}) rotate(${(angle * 180 / Math.PI) - 90})`)
   .attr("font-size", "5px")
   .attr("fill", color(d.data.stage))
   .text(song.data.name) }) 
   })
