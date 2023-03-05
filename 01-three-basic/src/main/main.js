import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 动画
import gsap from 'gsap'
//快捷操作
import * as dat from 'dat.gui'

// 1.渲染场景
const scene = new THREE.Scene()

// 2.渲染相机 (视野角度（FOV）,宽高比，近截面（near），远截面（far）)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)


// 3.创建渲染器
const renderer = new THREE.WebGLRenderer()
// s设置渲染器大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 将canvas画布添加到body
document.body.appendChild(renderer.domElement);


// 4.要创建一个立方体，我们需要一个BoxGeometry（立方体）对象. 这个对象包含了一个立方体中所有的顶点（vertices）和面（faces）。未来我们将在这方面进行更多的探索。

// 接下来，对于这个立方体，我们需要给它一个材质，来让它有颜色。Three.js自带了几种材质，在这里我们使用的是MeshBasicMaterial。所有的材质都存有应用于他们的属性的对象。在这里为了简单起见，我们只设置一个color属性，值为0x00ff00，也就是绿色。这里所做的事情，和在CSS或者Photoshop中使用十六进制(hex colors)颜色格式来设置颜色的方式一致。

// 第三步，我们需要一个Mesh（网格）。 网格包含一个几何体以及作用在此几何体上的材质，我们可以直接将网格对象放入到我们的场景中，并让它在场景中自由移动。

// 默认情况下，当我们调用scene.add()的时候，物体将会被添加到(0,0,0)坐标。但将使得摄像机和立方体彼此在一起。为了防止这种情况的发生，我们只需要将摄像机稍微向外移动一些即可。
// (长宽高)
const geometry = new THREE.BoxGeometry(1, 1, 1)

// 设置材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

// 物体
const cube = new THREE.Mesh(geometry, material)

//快捷操作
const gui = new dat.GUI()

// 添加属性
gui.add(cube.position, 'x').min(0).max(5).step(0.01).name('x轴移动')
  .onChange(() => {
    console.log('每次次触发')

  })
  .onFinishChange((v) => {
    console.log('最后一次触发')
  })
const params={
  color:'#000',
  fn(){
    gsap.to(cube.position,{x:5,direction:2,repeat:-1,yoyo:true})
  }
}

// 设置物体的颜色
gui.addColor(params,'color').name('物体颜色').onChange((value)=>{
  cube.material.color.set(value)
})

//设置选项框（值为boolean的话就是选择框）
gui.add(cube,'visible').name('是否显示')
const folder=gui.addFolder('设置立方体')
folder.add(cube.material,'wireframe').name('是否显示为框框')
folder.add(params,'fn').name('立方体运动')
// 修改物体位置
// cube.position.set(2, 0, 0)
// cube.position.x=2
// 缩放
// cube.scale.set(2,3,4)
// cube.scale.x=2
// 旋转
// cube.rotation.set(1,2,3,'XZY')
// cube.rotation.x=1
scene.add(cube)

// 创建坐标轴（长度）
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

camera.position.z = 5;

// 创建轨道控制器才可以旋转视角
const controls = new OrbitControls(camera, renderer.domElement)
//开启控制器阻尼
controls.enableDamping = true

const clock = new THREE.Clock()
// console.log(clock.running)

const animate1 = gsap.to(cube.position, {
  x: 5,//要改变的属性
  duration: 2,//动画时长
  ease: 'none',//动画线性
  repeat: -1,//是否重复运动（-1无限次）
  yoyo: true,//是否往返运动
  delay: 2,//延时2s开始动画
  onComplete() { console.log('动画完成了') },
  onStart() { console.log('动画开始') }
})
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 2, ease: 'none', repeat: -1, yoyo: true })



// 会接收time参数毫秒
function animate(time) {
  // let t =(time/1000)%5
  // cube.position.x=t*1


  //getDelta获取上次到这次的时间
  // console.log(clock.getDelta())

  // getElapsedTime 获取总时间
  // console.log(clock.getElapsedTime())

  renderer.render(scene, camera);

  controls.update()
  // 下一帧的时候调用
  requestAnimationFrame(animate);
}
animate();





window.addEventListener('click', () => {
  //isActive判断是否在运行动画,pause暂停动画,resume恢复动画
  // const {isActive,pause,resume}=animate1
  if (animate1.isActive()) animate1.pause()
  else animate1.resume()
})


window.addEventListener('dblclick', () => {
  //fullscreenElement不是全屏时是null
  const { fullscreenElement } = document
  if (!fullscreenElement) {
    // 全屏展示这个dom canvas
    renderer.domElement.requestFullscreen()
  } else {
    // 关闭全屏
    document.exitFullscreen()
  }
})

//监听页面变化重新渲染页面
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight, devicePixelRatio } = window
  // 更新摄像头位置
  camera.aspect = innerWidth / innerHeight
  // 更新摄像头的投影矩阵
  camera.updateProjectionMatrix()

  //更新渲染器
  renderer.setSize(innerWidth, innerHeight)
  //设置渲染器的像素比
  renderer.setPixelRatio(devicePixelRatio)
})