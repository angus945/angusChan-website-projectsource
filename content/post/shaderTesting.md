+++
title = "Shader Testing"
date = 2017-04-01T00:00:00+08:00
description = "shader"
tags = [
    "test",
    "shader"
]
showToc = false
+++



<!--more-->
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc

{{< fragCanvas size="300 300" >}}
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;

    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        gl_FragColor=vec4(st.x, st.y,0.0,1.0);
    }
{{< /fragCanvas >}}

<!--more-->

