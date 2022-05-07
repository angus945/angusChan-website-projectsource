---
title: "Scriptableobject Coroutine"
date: 2020-06-02
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!-- https://home.gamer.com.tw/creationDetail.php?sn=4803322 -->

<!--more-->

Scriptable Object
模組化的進階運用，模組化行為架構，搭配Coroutine

基本說明 (參考筆記 ScriptableObject 1.基本
物件池、模組化、繼承及覆寫

實作後確定會造成可讀性、架構上的問題，不建議用這種做法 7/25
------------------------------------------------------------------------------

運用 Coroutine

用於 EnemyData 實例化的物件、調用行為，以及物件池回收
public class EnemyObject : MonoBehaviour
{

    EnemyData enableData;

    void ResetObject() { //實例化，參數，視覺  }
    void EnemyActive()
    {
        StartCoroutine(enableData.Movement(this.transform));
    }
}
調用 EnemyData 的移動行為，並傳入 GameObject的Transform


模組化架構的核心，行為架構將被組裝在這上面
public class EnemyData : ScriptableObject  
{
    //other variable...

    [Header("EnemyBehaviours")]
    [SerializeField] BaseEnemyMovement enemyMovement = null;
    public IEnumerator Movement(Transform movementTrans)
    {
        return enemyMovement.Movement(movementTrans);
    }
}
在Inspector變量 BaseEnemyMovement 中，組裝上不同的行為 (BaseEnemyMovement
回傳移動行為 Routine，再交給 EnemyObject 調用


模組化的移動行為，建立一個空的行為給子腳本覆寫，讓 Coroutine傳入 Transform並做出移動行為
public class BaseEnemyMovement : ScriptableObject
{
    public virtual IEnumerator Movement(Transform movementTrans) { }
}
覆寫移動行為，繼承自 BaseEnemyMovement
public class RightMovement : BaseEnemyMovement
{
    public override IEnumerator Movement(Transform movementTrans)
    {        
        while (true)
        {
            movementTrans.position += Vector3.right * Time.deltaTime;         //持續向右移動
            yield return null;
        }
    }
}
public class LeftMovement : BaseEnemyMovement
{
    public override IEnumerator Movement(Transform movementTrans)
    {        
        while (true)
        {
            movementTrans.position += Vector3.left * Time.deltaTime;         //持續向左移動
            yield return null;
        }
    }
}


註
Transform(class)的call type為reference，傳入後也是直接引用傳入的 Transform，所以寫在 ScirptableObject裡的 Coroutine也能夠控制Transform
(參考筆記 call Sype 0 - value、class