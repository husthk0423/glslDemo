
export default {
    para:
    {
        gltfPath:'22',
        containerID:'11'
    },
    LoadGltf:(id,gltfpath)=>{
        var viewer = new Cesium.Viewer(id,{
            animation:false,       //是否显示动画控件
            homeButton:true,       //是否显示home键
            //geocoder:false,         //是否显示地名查找控件        如果设置为true，则无法查询
            baseLayerPicker:false, //是否显示图层选择控件
            timeline:false,        //是否显示时间线控件
            fullscreenButton:true, //是否全屏显示
            scene3DOnly:true,     //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            infoBox:true,         //是否显示点击要素之后显示的信息
            sceneModePicker:false,  //是否显示投影方式控件  三维/二维
            navigationInstructionsInitiallyVisible:false,
            navigationHelpButton:false,     //是否显示帮助信息控件  
            selectionIndicator:false,        //是否显示指示器组件
            //加载谷歌卫星影像
            imageryProvider : new Cesium.UrlTemplateImageryProvider({url:"http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"})
        });
            viewer._cesiumWidget._creditContainer.style.display = "none";  //	去除版权信息
            
            viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({   //调用影响中文注记服务
                 url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
                 layer: "tdtAnnoLayer",
                 style: "default",
                 format: "image/jpeg",
                 tileMatrixSetID: "GoogleMapsCompatible",
                 show: false
             }));
          //加载gltf格式数据到cesium   
           var scene=viewer.scene;     
            var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(  
                 Cesium.Cartesian3.fromDegrees(110.62898254394531, 40.02804946899414, 6.0));        //gltf数据加载位置
             var model = scene.primitives.add(Cesium.Model.fromGltf({  
              url : gltfpath,        //如果为bgltf则为.bgltf     
              modelMatrix : modelMatrix,  
              scale : 3.0     //放大倍数
            }));     
           viewer.camera.flyTo({  
               destination : Cesium.Cartesian3.fromDegrees(110.62898254394531, 40.02804946899414, 6000.0)     //相机飞入点
           }); 
     }
}