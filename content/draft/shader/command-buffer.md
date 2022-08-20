---
title: "【筆記】用命令緩衝區擴展內置管線"
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

用 Unity CommandBuffer 擴展 Bulit-in 管線

<!--more-->

如何對特定目標進行後處理

Graphics API

之前聽前輩說過 很多公司都不用 SpriteRenderer 渲染
而是直接調用 Grpahics


為了達成
把物件渲染到特定目標上

基礎的做法是在攝影機
攝影機
可以設定渲染目標
之前做的物件投影就是用這種方式做的

Unity 的渲染是 Camera Base 的，現在懂了
camera base rendering 和 target base rendering 了



找蠻多時間後發現一個 Command Buffer
> Command Buffers allow you to extend Unity’s built-in render pipeline. A Command Buffer holds a list of rendering commands which execute at various points during camera rendering. To specify a position in Unity’s built-in render pipeline for a Command Buffer to execute, use the CameraEvent enum.
> Command buffers hold list of rendering commands ("set render target, draw mesh, ..."). 





CommandBuffer + Compute Shader
可以覆寫整個渲染管線

手動觸發
Graphics.ExecuteCommandBuffer(commantBuffer); 
測不成功 放棄

註冊在攝影機上


BuiltinRenderTextureType.CameraTarget


---

https://blog.csdn.net/puppet_master/article/details/72669977
