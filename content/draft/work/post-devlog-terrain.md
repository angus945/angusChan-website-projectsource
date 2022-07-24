---
title: " "
date: 
lastmod:  

draft: true

description:
tags: []

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
# resources: /common/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

<!--more-->
【學習日誌】工具化和地形繪製修正

一樣接續上篇【學習日誌】物件筆刷和地形筆刷
https://home.gamer.com.tw/creationDetail.php?sn=5402986

前兩篇把各種系統的功能完成後，接下來就是把它們變成一套編輯器，讓這些系統能實際作為工具使用

自訂編輯器又是另一個分支了，雖然資料比著色器較好找
主要就是做工很多而已，有一點手刻 HTML 的感覺 
這部份的細節就跳過ㄌ

先上成果
mapPaint.mp4


> 編輯器繪製
原本的系統雖然能夠運作，但是那都是在 Runtime 運行的，因此修正的第一步就是要讓它也能在編輯模式下編輯。
原本嘗試只依靠 custom editor 完成，但實作後發現還是需要有一個在場景中，有 ExecuteInEditMode 的腳本作中繼才行。

基本上渲染方法合在 Runtime 時一樣，透過 Grpahics 的 API 調用，以及 ComputeShader 的剔除。
原本是透過 editor 的 OnEnable 函式檢測，在玩家選取地圖檔案的物件時會自動重建地圖，但後來發現地圖生成時的瞬間有太大量的 Instance 要建立會嚴重卡頓，所以改成透過按鈕來手動觸發
drawOnEditor.mp4



透過一些編輯器的函式和事件調用更新
OnRenderObject, DrawGizmos, EditorApplication.update


把操作指令傳遞給

還好 Graphics 的 GPU Instance 允許在編輯模式下使用


但也無法「刷新」Scene View


不能使用
OnRenderObject, DrawGizmos, EditorApplication.update

> 畫面刷新

Camera.onPreCull

檢查 FrameCount
防止調用次數高到爆炸
if(lastRenderFrame != Time.renderedFrameCount)
{
    Debug.Log(lastRenderFrame);
    constructor.DrawMap();

}
lastRenderFrame = Time.renderedFrameCount;

Graphics 命令沒那麼快更新
如果啟用 Frame Debugger 的話會正常


沒辦法正常刷新
Execute in editor 只會在 scene view 內容更新時觸發
但資料夾物件無效

還是需要一個 execute edit mode 的物件在場上做中繼



>

透過觸發更新
EditorUtility.SetDirty(target);
SceneView.RepaintAll();

> 輸入檢測
編輯功能也是透過 Input API 去檢測 Runtime 的輸入




GUI 的滑鼠位置
Vector2 mousePos = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition).origin;


    if (sceneEvent.button == 0)
    {
        intensity = 1;
    }
    if(sceneEvent.keyCode == KeyCode.LeftControl)
    {
        intensity = -1;
    }


> Editor

編輯器繪製
controlID = GUIUtility.GetControlID(FocusType.Passive);
HandleUtility.AddDefaultControl(controlID);

https://www.synnaxium.com/en/2019/01/unity-custom-map-editor-part-1/


https://blog.csdn.net/dgtgtjs2/article/details/50039417


Editor Window 也是 instance




> 雙緩衝

doubleBuffer.mp4




> 材質修正

重複感
無接縫能避免明顯的格子交界，但畫面拉遠還是會開始有重複感

旋轉 uv
不適合 2D 材質

http://makedreamvsogre.blogspot.com/2021/08/smooth-tile-processing.html


---

filter

無法只過濾權重

材質索引的通道部正確也沒辦法


