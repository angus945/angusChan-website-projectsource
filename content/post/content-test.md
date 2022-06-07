---
title: "重新施工中~~~~"
date: 2022-04-08
description: "shader"
tags: ["test", "shader"]

feature: "/common/gears.gif"
og: "/siteimage/gears.gif"

resources: "/common/"

listable: [all, recommand]

background: [watercolor-b] 

---

測試各種新玩具，主要是網頁的 Shader 嵌入，還有互動內容測試 

<!--more-->

### hi

```cs
print("hi");
```

```cs
print("hi");
```

```
print("hi");
```

## 自定義功能測試

### 測試著色器嵌入

測試一般 Shader 嵌入
{{< resources/shader "300 300" "sandboxShader.glsl" >}}
{{</ resources/shader >}}

測試 Float Silder
{{< resources/shader "300 300" "sandboxShader.glsl" >}}
float u_input0 0 1 0.5,
float u_input1 0 1 0.5,
float u_input2 0 1 0.5
{{</ resources/shader >}}

測試 Vector Picker
{{< resources/shader "300 300" "sandboxShader.glsl" >}}
vector u_position -1 -1 1 1 0 0
{{</ resources/shader >}}

```glsl
//language - glsl
uniform float u_input0;
uniform float u_input1;
uniform float u_input2;
uniform vec2 u_position;

void main() 
{
    vec2 uv = gl_FragCoord.xy / u_resolution.xx;

    uv = mix(vec2(-1), vec2(1), uv);

    float dist = sdf_cross(uv, u_position);
    vec4 color = vec4(u_input0, u_input1, u_input2, 1);
    gl_FragColor = mix(vec4(0), color, 1.0 - dist);
}
```

### 測試其他東西嵌入

嵌入圖片資源

{{< resources/image "gears.gif" "50%" "comment" >}}

嵌入音效資源

{{< resources/audio "audio_throw.mp3" >}}

### 測試文字上色

上色 <h> 提示 </h> 區塊

上色 <c> 註解 </c> 區塊

{{< content/comment >}}
上色，註解整段
{{</ content/comment >}}


## 原生模板功能測試


code block

```cs
void Start()
{
    Debug.Log("Hello World");
}
```


```hlsl
void Start()
{
    Debug.Log("Hello World");
}
```


