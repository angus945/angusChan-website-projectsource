---
title: "Scriptableobject"
date: 2020-05-18
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

早期的舊筆記
<!-- https://home.gamer.com.tw/creationDetail.php?sn=4786801 -->

<!--more-->

ScriptableObject

一種純數據的儲存方式，不包括GameObject和Component，沒有MonoBehaviour的負擔
修改數據時和Prefab一樣，所有引用此ScriptableObject的物件都會連動

建立方式 class 繼承: ScriptableObject
public class Data : ScriptableObject

實例方式 使用CreateAssetMenu前墜，在Project中實例化
[CreateAssetMenu(fileName = "New Data", menuName = "Data")]

------------------------------------------------------------------------------

物件池

純資料的儲存方式，能夠重複使用同一種物件顯示資料，如: 卡牌
在牌庫儲存資料，抽出後再使用顯示用的物件秀出資料
卡牌消耗後，把顯示物件的卡牌資料移除，再給下一張牌顯示使用

------------------------------------------------------------------------------

模組化
把資料拆成多個部分，並用組裝的方式組裝物件；
Boss (BasisData、VisualData、SkillA、SkillB)

組裝
BossA (基本數據A、視覺數據A、技能A、技能C)
BossB (基本數據B、視覺數據A、技能B、技能C)
BossC (基本數據C、視覺數據B、技能C、技能D)

------------------------------------------------------------------------------

繼承和覆寫
使用繼承添加額外參數，使用覆寫的方式更改Function
因為繼承自同一個 class(BasisSkill)，所以引用時仍然可以調用(覆寫後的)Function

public class BasisSkill : ScriptableObject
{
    public float skillDuration;
    public virtual void Skill() { }
}

public class DamageSkill : BasisSkill
{
    public int skillDamage;
    public override void Skill() { //Damage to target }
}
public class RegionSkill : BasisSkill
{
    public int skillDamage;
    public override void Skill() { //Damage to region }
}

覆寫這部分在搭配上模組化其實就有不少運用空間了
------------------------------------------------------------------------------

保存資料
在Editor中的RunTime更改ScriptableObjectk的數據，即使離開Runtime也會保留
(所以調用的時候要特別注意)
但Build後就不會保留，關閉後會自動恢復到Build時的資料