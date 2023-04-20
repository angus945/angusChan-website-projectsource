---
title: "Vertex Buffer"
date: 2023-04-17T09:04:19+08:00
# lastmod: 2023-04-17T09:04:19+08:00

show-title: true
show-meta: true

draft: true

description:
tags: []

socialshare: true

## image for preview
# feature: "/article/about-learning/featured.jpg"

## image for open graph
# og: "/article/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
# resources: /common/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]

# sitemap_ignore: true
---

<!--more-->

<!-- &nbsp; -->

<!-- [text]({ ref "relpath" })。 -->



[https://youtu.be/EB5HiqDl7VE](https://youtu.be/EB5HiqDl7VE)

[Unity - Scripting API: Mesh.GetVertexBuffer](https://docs.unity3d.com/ScriptReference/Mesh.GetVertexBuffer.html)

vertex buffer?

[Unity - Scripting API: Mesh.GetVertexBuffer](https://docs.unity3d.com/ScriptReference/Mesh.GetVertexBuffer.html)

https://docs.google.com/document/d/1_YrJafo9_ZsFm4-8K2QlD0k3RgwZ_49tSA84paobfcY/edit#

SkinnedMeshRenderer

[https://github.com/Unity-Technologies/MeshApiExamples](https://github.com/Unity-Technologies/MeshApiExamples)

修改 GPU 中的共用 vertex buffer

```csharp
Debug.Log(mesh.GetVertexBufferStride(0));
Debug.Log(mesh.GetVertexAttribute(0));
Debug.Log(mesh.GetVertexAttribute(1));
Debug.Log(mesh.GetVertexAttribute(2));
Debug.Log(mesh.GetVertexAttribute(3));
Debug.Log(mesh.GetVertexAttribute(4));
```

Plane, Quad

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6345c6d2-71cd-4fee-90bd-105a3542a55d/Untitled.png)

Sphere, Cube, Cylinder, Capsule

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8faa79f7-14e0-4d3b-b10e-f750d52f4511/Untitled.png)

- attr = 屬性
- fmt = 格式
- dim = 維度
- stream = ??

- Position

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/57195604-0a6a-461c-8a38-c6d98fe43839/Untitled.png)

透過檢查 知道有沒有錯誤

```glsl
int _BufferStride;
int _VertexCount;

[numthreads(64,1,1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    if(id.x >= _VertexCount) return;

    uint3 rawVertex = vertexBuffer.Load3(id.x * _BufferStride);
    float3 vertex = asfloat(rawVertex);

    uint3 rawNormal = vertexBuffer.Load3(id.x * _BufferStride + 12);
    float3 normal = asfloat(rawNormal);

    checkVertexBuffer[id.x] = vertex;
    checkNormalBuffer[id.x] = normal;
}
```

```csharp
checkVertexBuffer.GetData(checkVertex);

for (int i = 0; i < mesh.vertexCount; i++)
{
    if (mesh.vertices[i] != checkVertex[i])
    {
        Debug.LogError(i);
    }
}
```