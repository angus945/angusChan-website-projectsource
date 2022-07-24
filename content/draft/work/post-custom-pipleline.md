---
title: ""
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

擴展預設渲染管線

> 分離渲染
直接設定 render target 
無效

找怎麼把 gpu instance 輸出到特定目標上

camera base rendering 和 target base rendering 了，哭阿我要怎麼只輸出一個圖層到 render texture

https://blog.csdn.net/leonwei/article/details/54972653

https://www.reddit.com/r/Unity3D/comments/97t8t3/controlling_camera_rendering_manually_from_code/

找蠻多時間後發現一個 Command Buffer
| Command Buffers allow you to extend Unity’s built-in render pipeline. A Command Buffer holds a list of rendering commands which execute at various points during camera rendering. To specify a position in Unity’s built-in render pipeline for a Command Buffer to execute, use the CameraEvent enum.
| Command buffers hold list of rendering commands ("set render target, draw mesh, ..."). 

可以把 Graphics 的命令打包起來
對特定目標做動作

https://docs.unity3d.com/ru/2018.4/Manual/GraphicsCommandBuffers.html
https://blog.csdn.net/qq_37833413/article/details/104338115
https://blog.csdn.net/puppet_master/article/details/72669977


> 手動觸發

註冊進 Camera.main.AddCommandBuffer(CameraEvent.AfterForwardOpaque, commantBuffer); 有效
但手動調用會無效 Graphics.ExecuteCommandBuffer(commantBuffer);

GL 的 projection matrix 資料有問題

設置成
GL.LoadProjectionMatrix(Camera.main.previousViewProjectionMatrix);

能渲染，但結果會是反轉的
移動攝影機位置後壞了

要用
LoadPixelMatrix
https://docs.unity3d.com/ScriptReference/GL.LoadPixelMatrix.html

但
只畫了幾顆像素...

放棄
Camera.main.AddCommandBuffer(CameraEvent.BeforeForwardOpaque, commantBuffer);

> 圖層

透視投影有做到混和 但是透明度 額外輸出的 depth 不對

文檔裡說需要自訂 blit
https://docs.unity3d.com/ScriptReference/Graphics.Blit.html

https://answers.unity.com/questions/621279/using-the-stencil-buffer-in-a-post-process.html
https://answers.unity.com/questions/1594780/manual-graphicsblit.html
https://forum.unity.com/threads/commandbuffer-blit-isnt-stencil-buffer-friendly.432776/

直接修改 render queue


        targetA = new RenderTexture(Screen.width, Screen.height, 0, RenderTextureFormat.Default);
        targetB = new RenderTexture(Screen.width, Screen.height, 0, RenderTextureFormat.Default);
        depthTex = new RenderTexture(Screen.width, Screen.height, 24, RenderTextureFormat.Depth);

        instanceCcommandsA.SetRenderTarget(targetA.colorBuffer, depthTex.depthBuffer);
        instanceCcommandsB.SetRenderTarget(targetB.colorBuffer, depthTex.depthBuffer);

大小要相同
        Dimensions of color surface does not match dimensions of depth surface

> Screen

Blit to null
If you are using the Built-in Render Pipeline, when dest is null, 
Unity uses the screen backbuffer as the blit destination. However, 
if the main camera is set to render to a RenderTexture 
(that is, if Camera.main has a non-null targetTexture property), 
the blit uses the render target of the main camera as destination. 
To ensure that the blit actually writes to the screen backbuffer, 
make sure to set /Camera.main.targetTexture/ to null before calling Blit.
https://docs.unity3d.com/ScriptReference/Graphics.Blit.html


Blit to null 無效，資料會被拋棄
https://forum.unity.com/threads/commandbuffer-rendering-scene-flipped-upside-down-in-forward-rendering.415922/

要用
BuiltinRenderTextureType.CameraTarget



> BuiltinRenderTextureType.CameraTarget

直接將 CommandBuffer 的渲染指令寫入 Camera DepthBuffer

就能讓自訂渲染和 unity 內建 SpriteRenderer 支援

渲染順序必須是 CameraEvent.AfterForwardAlpha
sceneDepth.mp4

> 

Blit camera 後
原生的渲染無效

實驗
> 把最後的 blit 移除: 渲染正常，排除物件 command buffer 造成的問題
> Blit 一張 clear 的 tex: 渲染無效
> 用 Blend Zero One, Return 0 的 Shader Blit: 渲染無效，排除透明度和色彩的問題
> Blit 任意 Tex，但 clear CameraTarget (true, true): 渲染正常
> Blit 任意 Tex，但 clear CameraTarget (false, false): 渲染無效
> Blit 任意 Tex，但 clear CameraTarget (false, true): 渲染無效
> Blit 任意 Tex，但 clear CameraTarget (true, false): 渲染正常，深度無效
> 結論: Blit CameraTarget 對 camera depth 造成某些引響


猜測
> Blit 將資訊寫入 Depth Buffer?
> 將 Blit Shader 的 ZWrite Off: 渲染正常，深度有效

解答
可能的原因:
Blit 的目標 Identifier 為 CameraTarget，包括 Camera Target Color, Septh, (可能也包括 Stencil ?)
RenderTexture 雖然沒有啟用 Depth，但他的 depth 數值還是 0，所以 Blit 時把所有像素的 depth 都寫入 0 了
導致後續的所有渲染都被深度剔除擋掉






---