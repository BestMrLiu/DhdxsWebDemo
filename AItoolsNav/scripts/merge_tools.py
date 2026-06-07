#!/usr/bin/env python3
"""Merge AI tools from ai-bot.cn and fmhy.net into tools.js"""
import json, re, sys
from datetime import datetime

# Category mapping: source categories → our unified categories
CAT_MAP = {
    # ai-bot.cn categories
    'AI写作工具': '文案写作', 'AI写作': '文案写作',
    'AI图像工具': '图像生成', 'AI图像': '图像生成',
    'AI视频工具': '视频生成', 'AI视频': '视频生成',
    'AI办公工具': '效率&自动化', 'AI办公': '效率&自动化',
    'AI聊天机器人': '对话助手', 'AI聊天助手': '对话助手', 'AI聊天': '对话助手',
    'AI智能体': 'AI Agent', 'AI代理': 'AI Agent',
    'AI编程工具': '代码辅助', 'AI编程': '代码辅助',
    'AI开发平台': 'AI API',
    'AI设计工具': 'AI设计', 'AI设计': 'AI设计',
    'AI音频工具': '音频&音乐', 'AI音频': '音频&音乐',
    'AI搜索引擎': 'AI搜索', 'AI搜索': 'AI搜索',
    'AI学习网站': '效率&自动化',
    'AI训练模型': 'AI API',
    'AI模型评测': 'AI API',
    'AI内容检测': '文案写作',
    'AI提示指令': '效率&自动化',
    'AI副业工具': '效率&自动化',
    # fmhy categories
    'AI Chatbots': '对话助手', 'chat': '对话助手',
    'Video Generation': '视频生成', 'video': '视频生成',
    'Image Generation': '图像生成', 'image': '图像生成',
    'Audio Generation': '音频&音乐', 'audio': '音频&音乐',
    'AI Coding Tools': '代码辅助', 'coding': '代码辅助',
    'AI Agents': 'AI Agent', 'agent': 'AI Agent',
    'AI Search Engines': 'AI搜索', 'search': 'AI搜索',
    'AI Design Tools': 'AI设计',
}

# Comprehensive new tools from ai-bot.cn
NEW_TOOLS = [
    # === 文案写作 (key ones not in current db) ===
    {"name":"笔灵AI写作","desc":"600+写作模板、AI一键生成论文/小说，论文降重降AI","cat":"文案写作","pricing":"免费/付费","rating":4.2,"url":"https://ibiling.cn","domain":"ibiling.cn"},
    {"name":"讯飞绘文","desc":"AI批量原创，多平台矩阵号管理","cat":"文案写作","pricing":"免费/付费","rating":4.1,"url":"https://www.iflyrec.com","domain":"iflyrec.com"},
    {"name":"蛙蛙写作","desc":"AI小说和内容创作工具","cat":"文案写作","pricing":"免费/付费","rating":4.0,"url":"https://www.91wawa.com","domain":"91wawa.com"},
    {"name":"茅茅虫","desc":"一站式AI论文写作助手","cat":"文案写作","pricing":"免费/付费","rating":4.2,"url":"https://www.maomaochong.com","domain":"maomaochong.com"},
    {"name":"66AI论文","desc":"高质量、低查重、低AIGC率的AI论文写作工具","cat":"文案写作","pricing":"免费/付费","rating":4.3,"url":"https://www.66ai.cc","domain":"66ai.cc"},
    {"name":"千笔AI论文","desc":"全网首家论文无限改稿平台","cat":"文案写作","pricing":"免费/付费","rating":4.1,"url":"https://www.qianbi.com","domain":"qianbi.com"},
    {"name":"万能小in","desc":"3分钟4万字150+应用，快速生成毕业论文","cat":"文案写作","pricing":"免费/付费","rating":4.0,"url":"https://www.xiaoin.com","domain":"xiaoin.com"},
    {"name":"Paperpal","desc":"英文论文写作助手","cat":"文案写作","pricing":"免费/付费","rating":4.4,"url":"https://paperpal.cn","domain":"paperpal.cn"},
    {"name":"新华妙笔","desc":"新华社推出的AI公文写作平台","cat":"文案写作","pricing":"免费/付费","rating":4.2,"url":"https://www.xinhuamiaobi.com","domain":"xinhuamiaobi.com"},
    {"name":"光速写作","desc":"AI写作、PPT生成工具，单篇最长15000字","cat":"文案写作","pricing":"免费/付费","rating":4.1,"url":"https://www.guangsu.com","domain":"guangsu.com"},
    {"name":"GetDraft","desc":"得到推出的多AI专家协作AI写作工具","cat":"文案写作","pricing":"免费/付费","rating":4.3,"url":"https://www.getdraft.cn","domain":"getdraft.cn"},
    {"name":"小鱼AI写作","desc":"一站式AI写作平台，一键生成高质量原创内容","cat":"文案写作","pricing":"免费/付费","rating":4.0,"url":"https://www.xiaoyuai.com","domain":"xiaoyuai.com"},
    {"name":"落笔AI写作","desc":"专注于小说网文创作的AI写作工具","cat":"文案写作","pricing":"免费/付费","rating":4.1,"url":"https://www.luobi.com","domain":"luobi.com"},
    {"name":"材料星AI","desc":"专为秘书工作设计的AI写作工具","cat":"文案写作","pricing":"免费/付费","rating":4.0,"url":"https://www.cailiaoxing.com","domain":"cailiaoxing.com"},
    {"name":"沁言学术","desc":"AI科研写作平台，一站式文献管理","cat":"文案写作","pricing":"免费/付费","rating":4.2,"url":"https://www.qinyanxueshu.com","domain":"qinyanxueshu.com"},
    
    # === AI Agent (key ones) ===
    {"name":"Manus","desc":"蝴蝶效应公司推出的首款自主通用AI Agent","cat":"AI Agent","pricing":"付费","rating":4.5,"url":"https://manus.im","domain":"manus.im","year":2025,"best":"自主执行任务 · 无需人工干预","weak":"付费门槛"},
    {"name":"扣子","desc":"免费全能的AI办公智能体平台","cat":"AI Agent","pricing":"免费","rating":4.3,"url":"https://www.coze.cn","domain":"coze.cn","year":2024,"best":"免费 · 中文生态 · 插件丰富","weak":"复杂场景受限"},
    {"name":"WorkBuddy","desc":"腾讯云推出的AI原生桌面智能体工作台","cat":"AI Agent","pricing":"免费","rating":4.2,"url":"https://workbuddy.cloud.tencent.com","domain":"workbuddy.cloud.tencent.com","year":2025},
    {"name":"OpenClaw","desc":"开源免费的个人AI助手","cat":"AI Agent","pricing":"免费开源","rating":4.4,"url":"https://openclaw.ai","domain":"openclaw.ai","year":2024},
    {"name":"QClaw","desc":"腾讯电脑管家团队基于OpenClaw打造的本地AI助手","cat":"AI Agent","pricing":"免费","rating":4.1,"url":"https://qclaw.qq.com","domain":"qclaw.qq.com","year":2025},
    {"name":"Mavis","desc":"MiniMax Agent推出的多Agent协作模式","cat":"AI Agent","pricing":"免费/付费","rating":4.3,"url":"https://mavis.minimax.io","domain":"minimax.io","year":2025},
    {"name":"Genspark","desc":"通用AI智能体，一站式AI工作空间","cat":"AI Agent","pricing":"免费/付费","rating":4.2,"url":"https://www.genspark.ai","domain":"genspark.ai","year":2024},
    {"name":"Atoms","desc":"第一支自动构建真实业务的AI团队","cat":"AI Agent","pricing":"付费","rating":4.3,"url":"https://www.atoms.ai","domain":"atoms.ai","year":2025},
    
    # === AI设计 ===
    {"name":"墨刀AI","desc":"AI秒生原型稿","cat":"AI设计","pricing":"免费/付费","rating":4.2,"url":"https://modao.cc","domain":"modao.cc"},
    {"name":"创客贴AI","desc":"AI辅助的智能在线设计工具","cat":"AI设计","pricing":"免费/付费","rating":4.3,"url":"https://www.chuangkit.com","domain":"chuangkit.com"},
    {"name":"Recraft AI","desc":"免费无限AI画板，生成高质量矢量艺术画、图标、3D图片和插画","cat":"图像生成","pricing":"免费/付费","rating":4.4,"url":"https://www.recraft.ai","domain":"recraft.ai"},
    {"name":"稿定AI设计","desc":"一站式AI设计工具集，免费AI绘图、图片转AI绘画、AI抠图消除","cat":"AI设计","pricing":"免费/付费","rating":4.3,"url":"https://www.gaoding.com","domain":"gaoding.com"},
    {"name":"Pixso AI","desc":"Pixso推出的AI设计工具","cat":"AI设计","pricing":"免费/付费","rating":4.1,"url":"https://pixso.cn","domain":"pixso.cn"},
    {"name":"Figma AI","desc":"Figma推出的原生AI设计工具","cat":"AI设计","pricing":"免费/付费","rating":4.5,"url":"https://www.figma.com","domain":"figma.com"},
    {"name":"爱设计","desc":"AI在线设计平台，提供多端在线拖拽设计工具","cat":"AI设计","pricing":"免费/付费","rating":4.0,"url":"https://www.isheji.com","domain":"isheji.com"},
    
    # === AI浏览器 ===
    {"name":"Cherry Studio","desc":"开源全能AI客户端助手","cat":"AI浏览器","pricing":"免费开源","rating":4.4,"url":"https://cherry-ai.com","domain":"cherry-ai.com"},
    {"name":"Chatbox AI","desc":"开源的AI客户端助手，支持多种主流AI模型","cat":"AI浏览器","pricing":"免费开源","rating":4.3,"url":"https://chatboxai.app","domain":"chatboxai.app"},
    {"name":"LobeHub","desc":"桌面AI应用","cat":"AI浏览器","pricing":"免费开源","rating":4.2,"url":"https://lobechat.com","domain":"lobechat.com"},
    {"name":"Tabbit","desc":"美团光年之外推出的AI原生浏览器","cat":"AI浏览器","pricing":"免费","rating":4.1,"url":"https://tabbit.ai","domain":"tabbit.ai","year":2025},
    
    # === AI搜索 ===
    {"name":"秘塔AI搜索","desc":"最好用的AI搜索工具，没有广告，直达结果","cat":"AI搜索","pricing":"免费/Pro","rating":4.5,"url":"https://metaso.cn","domain":"metaso.cn"},
    {"name":"纳米AI","desc":"360推出的新一代超级AI搜索工具","cat":"AI搜索","pricing":"免费","rating":4.2,"url":"https://www.n.cn","domain":"n.cn"},
    {"name":"知乎直答","desc":"知乎推出的AI搜索引擎，直达问题答案","cat":"AI搜索","pricing":"免费","rating":4.3,"url":"https://zhida.zhihu.com","domain":"zhida.zhihu.com"},
    {"name":"Felo","desc":"免费AI智能搜索引擎，支持社交联网搜索和多语种问答","cat":"AI搜索","pricing":"免费/付费","rating":4.2,"url":"https://felo.ai","domain":"felo.ai"},
    {"name":"博查AI搜索","desc":"支持多模型的AI搜索引擎","cat":"AI搜索","pricing":"免费/付费","rating":4.1,"url":"https://www.bochaai.com","domain":"bochaai.com"},
    {"name":"心流","desc":"阿里旗下推出的AI搜索助手","cat":"AI搜索","pricing":"免费","rating":4.2,"url":"https://xinliu.ai","domain":"xinliu.ai"},
    {"name":"Devv","desc":"面向程序员的新一代AI搜索引擎","cat":"AI搜索","pricing":"免费/付费","rating":4.3,"url":"https://devv.ai","domain":"devv.ai"},
    {"name":"点点","desc":"小红书推出的AI搜索应用，主打生活场景","cat":"AI搜索","pricing":"免费","rating":4.1,"url":"https://diandian.com","domain":"diandian.com"},
    
    # === 代码辅助 ===
    {"name":"通义灵码","desc":"阿里推出的免费AI编程工具，基于通义大模型","cat":"代码辅助","pricing":"免费","rating":4.3,"url":"https://tongyi.aliyun.com/lingma","domain":"lingma.aliyun.com"},
    {"name":"TRAE","desc":"字节跳动推出的AI IDE编程工具","cat":"代码辅助","pricing":"免费","rating":4.2,"url":"https://www.trae.ai","domain":"trae.ai"},
    {"name":"秒哒","desc":"无代码AI应用开发平台，一句话做应用","cat":"代码辅助","pricing":"免费/付费","rating":4.2,"url":"https://www.miaoda.com","domain":"miaoda.com"},
    {"name":"CodeBuddy IDE","desc":"腾讯推出的全栈开发AI IDE","cat":"代码辅助","pricing":"免费","rating":4.3,"url":"https://copilot.tencent.com","domain":"copilot.tencent.com"},
    {"name":"Google Antigravity","desc":"谷歌推出的AI IDE编程智能体","cat":"代码辅助","pricing":"免费","rating":4.4,"url":"https://antigravity.google","domain":"antigravity.google"},
    {"name":"Kiro","desc":"亚马逊公司推出的AI IDE","cat":"代码辅助","pricing":"免费/付费","rating":4.1,"url":"https://kiro.dev","domain":"kiro.dev"},
    {"name":"CatPaw","desc":"美团推出的AI IDE编程工具","cat":"代码辅助","pricing":"免费","rating":4.0,"url":"https://catpaw.ai","domain":"catpaw.ai"},
    {"name":"Codex","desc":"OpenAI推出的AI编程智能体","cat":"代码辅助","pricing":"付费","rating":4.5,"url":"https://openai.com","domain":"openai.com"},
    {"name":"Lovable","desc":"全栈AI编程工具，一句话构建网站应用","cat":"代码辅助","pricing":"免费/付费","rating":4.4,"url":"https://lovable.dev","domain":"lovable.dev"},
    {"name":"Bolt.new","desc":"StackBlitz推出的全栈AI代码工具","cat":"代码辅助","pricing":"免费/付费","rating":4.3,"url":"https://bolt.new","domain":"bolt.new"},
    
    # === 视频生成 ===
    {"name":"即梦AI","desc":"抖音旗下免费AI视频和图片创作工具","cat":"视频生成","pricing":"免费","rating":4.4,"url":"https://jimeng.jianying.com","domain":"jianying.com"},
    {"name":"Vidu","desc":"生数科技推出的AI视频生成大模型","cat":"视频生成","pricing":"免费/付费","rating":4.3,"url":"https://www.vidu.com","domain":"vidu.com"},
    {"name":"Seedance","desc":"字节跳动Seed团队推出的多模态AI视频生成模型","cat":"视频生成","pricing":"免费/付费","rating":4.3,"url":"https://seedance.ai","domain":"seedance.ai"},
    {"name":"HeyGen","desc":"专业的AI数字人视频创作平台","cat":"视频生成","pricing":"付费","rating":4.5,"url":"https://www.heygen.com","domain":"heygen.com"},
    {"name":"PixVerse","desc":"AI视频生成工具","cat":"视频生成","pricing":"免费/付费","rating":4.1,"url":"https://pixverse.ai","domain":"pixverse.ai"},
    {"name":"有言","desc":"一站式AI视频创作和3D数字人生成平台","cat":"视频生成","pricing":"免费/付费","rating":4.2,"url":"https://www.youyan.com","domain":"youyan.com"},
    {"name":"白日梦","desc":"领先AI创作平台，可生成最长50分钟的视频","cat":"视频生成","pricing":"免费/付费","rating":4.0,"url":"https://www.bairimeng.com","domain":"bairimeng.com"},
    {"name":"Pollo AI","desc":"一站式AI图像和视频创作平台","cat":"视频生成","pricing":"免费/付费","rating":4.2,"url":"https://pollo.ai","domain":"pollo.ai"},
    {"name":"LibTV","desc":"专业AI视频创作平台","cat":"视频生成","pricing":"免费/付费","rating":4.1,"url":"https://libtv.vip","domain":"libtv.vip"},
    
    # === 音频&音乐 ===
    {"name":"海绵音乐","desc":"字节跳动推出的免费AI音乐创作和发现平台","cat":"音频&音乐","pricing":"免费","rating":4.2,"url":"https://www.haimian.com","domain":"haimian.com"},
    {"name":"音疯","desc":"昆仑万维推出的AI音乐创作平台，一键生成原创歌曲","cat":"音频&音乐","pricing":"免费/付费","rating":4.1,"url":"https://www.yinfeng.com","domain":"yinfeng.com"},
    {"name":"Mureka","desc":"昆仑万维推出的AI音乐商用创作平台","cat":"音频&音乐","pricing":"免费/付费","rating":4.3,"url":"https://www.mureka.ai","domain":"mureka.ai"},
    {"name":"魔音工坊","desc":"AI配音工具，轻松配出媲美真人的声音","cat":"音频&音乐","pricing":"免费/付费","rating":4.2,"url":"https://www.moyin.com","domain":"moyin.com"},
    {"name":"讯飞智作","desc":"AI文本配音工具，数字人课程、营销视频制作","cat":"音频&音乐","pricing":"免费/付费","rating":4.3,"url":"https://www.iflyrec.com","domain":"iflyrec.com"},
    {"name":"Tunee","desc":"首个对话式音乐创作AI智能体","cat":"音频&音乐","pricing":"免费/付费","rating":4.1,"url":"https://tunee.ai","domain":"tunee.ai"},
    {"name":"MemoAI","desc":"免费的AI语音转文字工具","cat":"音频&音乐","pricing":"免费","rating":4.3,"url":"https://memo.ac","domain":"memo.ac"},
    {"name":"Fish Audio","desc":"语音合成平台，支持声音克隆","cat":"音频&音乐","pricing":"免费/付费","rating":4.2,"url":"https://fish.audio","domain":"fish.audio"},
    
    # === 效率&自动化 ===
    {"name":"AiPPT","desc":"AI快速生成高质量PPT","cat":"效率&自动化","pricing":"免费/付费","rating":4.3,"url":"https://www.aippt.cn","domain":"aippt.cn"},
    {"name":"讯飞智文","desc":"一键生成PPT和Word","cat":"效率&自动化","pricing":"免费/付费","rating":4.2,"url":"https://www.iflyrec.com","domain":"iflyrec.com"},
    {"name":"Gamma","desc":"AI幻灯片演示生成工具","cat":"效率&自动化","pricing":"免费/付费","rating":4.5,"url":"https://gamma.app","domain":"gamma.app"},
    {"name":"博思AIPPT","desc":"PPT效率神器，AI一键生成PPT","cat":"效率&自动化","pricing":"免费/付费","rating":4.1,"url":"https://www.ibos.cn","domain":"ibos.cn"},
    {"name":"iSlide AIPPT","desc":"AI一键设计精美PPT，只需一句标题","cat":"效率&自动化","pricing":"免费/付费","rating":4.2,"url":"https://www.islide.cc","domain":"islide.cc"},
    {"name":"Kimi PPT助手","desc":"Kimi全新自研的PPT助手，一键生成PPT","cat":"效率&自动化","pricing":"免费","rating":4.3,"url":"https://kimi.moonshot.cn","domain":"moonshot.cn"},
    {"name":"美图AI PPT","desc":"美图秀秀推出的免费在线AI生成PPT设计工具","cat":"效率&自动化","pricing":"免费","rating":4.1,"url":"https://www.meitu.com","domain":"meitu.com"},
    {"name":"Make","desc":"自动化工作流平台，无需代码连接各应用","cat":"效率&自动化","pricing":"免费/付费","rating":4.5,"url":"https://www.make.com","domain":"make.com"},
    {"name":"Zapier","desc":"自动化工作流平台，连接7000+应用","cat":"效率&自动化","pricing":"免费/付费","rating":4.4,"url":"https://zapier.com","domain":"zapier.com"},
    {"name":"飞象老师","desc":"猿辅导推出的国内首个AI教学和备课工具","cat":"效率&自动化","pricing":"免费/付费","rating":4.2,"url":"https://www.flyelephant.com","domain":"flyelephant.com"},
    
    # === 对话助手 ===
    {"name":"千问","desc":"阿里通义Qwen模型全能AI助手","cat":"对话助手","pricing":"免费/API付费","rating":4.3,"url":"https://chat.qwen.ai","domain":"qwen.ai"},
    {"name":"智谱清言","desc":"智谱推出的全能AI助手，基于GLM模型","cat":"对话助手","pricing":"免费/付费","rating":4.3,"url":"https://chatglm.cn","domain":"chatglm.cn"},
    {"name":"讯飞星火","desc":"AI智能助手，免费PPT生成、深度研究","cat":"对话助手","pricing":"免费/付费","rating":4.2,"url":"https://xinghuo.xfyun.cn","domain":"xfyun.cn"},
    {"name":"百小应","desc":"百川智能推出的免费AI助手","cat":"对话助手","pricing":"免费","rating":4.1,"url":"https://www.baixiaoying.com","domain":"baixiaoying.com"},
    {"name":"阶跃AI","desc":"阶跃星辰推出的支持多模态的AI聊天机器人","cat":"对话助手","pricing":"免费","rating":4.2,"url":"https://www.jieyue.com","domain":"jieyue.com"},
    {"name":"天工AI","desc":"昆仑万维推出的AI智能助手","cat":"对话助手","pricing":"免费/付费","rating":4.1,"url":"https://www.tiangong.cn","domain":"tiangong.cn"},
    {"name":"问小白","desc":"AI智能助手，支持DeepSeek满血版","cat":"对话助手","pricing":"免费","rating":4.0,"url":"https://www.wenxiaobai.com","domain":"wenxiaobai.com"},
    {"name":"MiniMax","desc":"MiniMax推出的AI智能问答助手","cat":"对话助手","pricing":"免费/付费","rating":4.2,"url":"https://hailuoai.com","domain":"hailuoai.com"},
    {"name":"LongCat","desc":"美团推出的自研大模型AI对话平台","cat":"对话助手","pricing":"免费","rating":4.1,"url":"https://longcat.chat","domain":"longcat.chat"},
    
    # === 图像生成 ===
    {"name":"liblibai","desc":"国内领先的AI图像创作平台和模型分享社区","cat":"图像生成","pricing":"免费/付费","rating":4.3,"url":"https://www.liblib.art","domain":"liblib.art"},
    {"name":"堆友AI","desc":"专为设计师打造的AI设计服务平台","cat":"图像生成","pricing":"免费/付费","rating":4.2,"url":"https://www.duiyou.com","domain":"duiyou.com"},
    {"name":"通义万相","desc":"阿里推出的AI创意内容生成平台","cat":"图像生成","pricing":"免费/付费","rating":4.2,"url":"https://tongyi.aliyun.com/wanxiang","domain":"aliyun.com"},
    {"name":"WHEE","desc":"美图推出的AI图片和绘画创作生成平台","cat":"图像生成","pricing":"免费/付费","rating":4.1,"url":"https://www.whee.com","domain":"whee.com"},
    {"name":"秒画","desc":"商汤科技推出的免费AI作画和图片生成平台","cat":"图像生成","pricing":"免费","rating":4.0,"url":"https://www.miaohua.com","domain":"miaohua.com"},
    {"name":"Krea AI","desc":"实时AI图像、视频生成和编辑平台","cat":"图像生成","pricing":"免费/付费","rating":4.3,"url":"https://www.krea.ai","domain":"krea.ai"},
    {"name":"Civitai","desc":"免费的AI图像绘画作品和模型分享平台和社区","cat":"图像生成","pricing":"免费","rating":4.5,"url":"https://civitai.com","domain":"civitai.com"},
    
    # === 更多工具 (ai-bot.cn batch 2) ===
    {"name":"美图设计室","desc":"AI图像创作和设计平台","cat":"AI设计","pricing":"免费/付费","rating":4.2,"url":"https://designkit.cn","domain":"designkit.cn"},
    {"name":"稿定PPT","desc":"稿定推出的PPT模板资源库","cat":"效率&自动化","pricing":"免费/付费","rating":4.1,"url":"https://www.gaoding.com/ppt","domain":"gaoding.com"},
    {"name":"稿易AI论文","desc":"AI论文写作助手，免费生成2000字大纲","cat":"文案写作","pricing":"免费/付费","rating":4.0,"url":"https://www.gaoyi.com","domain":"gaoyi.com"},
    {"name":"笔灵AI小说","desc":"AI一键写全篇+爆文拆解，小说创作过稿神器","cat":"文案写作","pricing":"免费/付费","rating":4.2,"url":"https://ibiling.cn","domain":"ibiling.cn"},
    {"name":"丹青妙笔","desc":"专为体制内打造的AI公文写作工具","cat":"文案写作","pricing":"免费/付费","rating":4.0,"url":"https://www.danqing.com","domain":"danqing.com"},
    {"name":"文章润色AI","desc":"AI文章写作和润色助手","cat":"文案写作","pricing":"免费/付费","rating":4.0,"url":"https://www.runseai.com","domain":"runseai.com"},
    {"name":"Loomi","desc":"创作版Claude Code，AI原生写作工具","cat":"文案写作","pricing":"免费/付费","rating":4.2,"url":"https://loomi.ai","domain":"loomi.ai"},
    {"name":"超级小说家","desc":"专为网文作家和短剧编剧打造的AI创作助手","cat":"文案写作","pricing":"免费/付费","rating":4.1,"url":"https://www.chaojixiaoshuojia.com","domain":"chaojixiaoshuojia.com"},
    {"name":"创飞写作","desc":"新一代智能AIGC写作调度平台","cat":"文案写作","pricing":"免费/付费","rating":4.0,"url":"https://www.chuangfei.com","domain":"chuangfei.com"},
    {"name":"绘蛙AI","desc":"AI电商营销工具，免费生成商品图","cat":"图像生成","pricing":"免费/付费","rating":4.3,"url":"https://www.huiwa.com","domain":"huiwa.com"},
    {"name":"造点AI","desc":"夸克团队推出的AI图像与视频创作平台","cat":"图像生成","pricing":"免费","rating":4.0,"url":"https://www.zaodian.com","domain":"zaodian.com"},
    {"name":"RunningHub","desc":"基于云端ComfyUI的AI图像与视频创作平台","cat":"图像生成","pricing":"免费/付费","rating":4.1,"url":"https://www.runninghub.com","domain":"runninghub.com"},
    {"name":"AI改图神器","desc":"AI在线图像编辑工具","cat":"图像生成","pricing":"免费/付费","rating":4.0,"url":"https://www.aitugai.com","domain":"aitugai.com"},
    {"name":"妙话AI","desc":"专为内容创作者设计的创意图片生成工具","cat":"图像生成","pricing":"免费/付费","rating":4.0,"url":"https://www.miaohuaai.com","domain":"miaohuaai.com"},
    {"name":"Pic Copilot","desc":"阿里国际推出的AI电商设计工具","cat":"AI设计","pricing":"免费/付费","rating":4.2,"url":"https://www.piccopilot.com","domain":"piccopilot.com"},
    {"name":"逗哥配音","desc":"一站式AI配音工具，抖音爆款配音始发地","cat":"音频&音乐","pricing":"免费/付费","rating":4.1,"url":"https://www.douge.com","domain":"douge.com"},
    {"name":"琅琅配音","desc":"智能文本转语音工具","cat":"音频&音乐","pricing":"免费/付费","rating":4.0,"url":"https://www.langlang.com","domain":"langlang.com"},
    {"name":"Nafy AI","desc":"在线AI音乐生成器，支持扩展、替换、翻唱","cat":"音频&音乐","pricing":"免费/付费","rating":4.0,"url":"https://nafy.ai","domain":"nafy.ai"},
    {"name":"Reecho睿声","desc":"超拟真的中英文AI语音克隆/生成平台","cat":"音频&音乐","pricing":"免费/付费","rating":4.2,"url":"https://www.reecho.com","domain":"reecho.com"},
    {"name":"讯飞译制","desc":"科大讯飞推出的AI音视频本地化平台","cat":"音频&音乐","pricing":"免费/付费","rating":4.1,"url":"https://www.iflyrec.com","domain":"iflyrec.com"},
    {"name":"码上飞","desc":"一句话生成微信小程序、APP、H5网页","cat":"代码辅助","pricing":"免费","rating":4.3,"url":"https://www.codefly.com","domain":"codefly.com"},
    {"name":"Zion","desc":"全栈开发AI Agent应用的无代码开发平台","cat":"代码辅助","pricing":"免费/付费","rating":4.1,"url":"https://www.zion.cn","domain":"zion.cn"},
    {"name":"Seko","desc":"首个创编一体的AI视频创作Agent","cat":"视频生成","pricing":"免费/付费","rating":4.2,"url":"https://www.seko.ai","domain":"seko.ai"},
    {"name":"蝉镜","desc":"AI数字人视频生成平台","cat":"视频生成","pricing":"免费/付费","rating":4.2,"url":"https://www.chanjing.com","domain":"chanjing.com"},
    {"name":"魔珐星云","desc":"具身智能3D数字人开放平台","cat":"视频生成","pricing":"免费/付费","rating":4.1,"url":"https://www.mofa.com","domain":"mofa.com"},
    {"name":"Flova","desc":"全球首个一体化AI视频创作平台","cat":"视频生成","pricing":"免费/付费","rating":4.0,"url":"https://flova.ai","domain":"flova.ai"},
    {"name":"JoyPix","desc":"AI数字人创作工具，支持声音克隆","cat":"视频生成","pricing":"免费/付费","rating":4.0,"url":"https://www.joypix.com","domain":"joypix.com"},
    {"name":"OneFlow","desc":"一站式AI工作流管理平台","cat":"效率&自动化","pricing":"免费/付费","rating":4.0,"url":"https://www.oneflow.com","domain":"oneflow.com"},
    {"name":"Trickle AI","desc":"一站式无代码AI开发平台","cat":"效率&自动化","pricing":"免费/付费","rating":4.1,"url":"https://trickle.so","domain":"trickle.so"},
    {"name":"博查万象","desc":"博查多模态混合搜索和语义排序API平台","cat":"AI搜索","pricing":"付费","rating":4.0,"url":"https://www.bocha.cn","domain":"bocha.cn"},
    {"name":"百灵大模型","desc":"蚂蚁集团推出的Ling-1T大模型对话体验平台","cat":"对话助手","pricing":"免费","rating":4.2,"url":"https://www.lingai.com","domain":"lingai.com"},
    {"name":"百川智能","desc":"百川智能推出的免费AI助手","cat":"对话助手","pricing":"免费","rating":4.1,"url":"https://www.baichuan-ai.com","domain":"baichuan-ai.com"},
    {"name":"商量SenseChat","desc":"商汤科技推出的免费AI聊天助手","cat":"对话助手","pricing":"免费","rating":4.0,"url":"https://www.sensetime.com","domain":"sensetime.com"},
    {"name":"华为小艺","desc":"华为旗下小艺AI助手网页端，已接入DeepSeek-R1","cat":"对话助手","pricing":"免费","rating":4.1,"url":"https://www.huawei.com","domain":"huawei.com"},
    {"name":"Lorka AI","desc":"多模型AI聚合对话平台","cat":"对话助手","pricing":"免费/付费","rating":4.0,"url":"https://lorka.ai","domain":"lorka.ai"},
    {"name":"iFlow CLI","desc":"心流AI推出的免费终端AI智能体","cat":"AI Agent","pricing":"免费","rating":4.0,"url":"https://iflow.cn","domain":"iflow.cn"},
    {"name":"Qoder","desc":"阿里巴巴推出的AI Agentic编程工具","cat":"代码辅助","pricing":"免费/付费","rating":4.2,"url":"https://qoder.cn","domain":"qoder.cn"},
    {"name":"Inception Chat","desc":"Mercury 2模型对话平台","cat":"对话助手","pricing":"免费","rating":4.1,"url":"https://chat.inceptionlabs.ai","domain":"inceptionlabs.ai"},
    {"name":"Apertus","desc":"Apertus 70B模型对话平台","cat":"对话助手","pricing":"免费","rating":4.0,"url":"https://publicai.co","domain":"publicai.co"},
    {"name":"Mistral","desc":"Mistral Large 3模型对话平台","cat":"对话助手","pricing":"免费/付费","rating":4.3,"url":"https://chat.mistral.ai","domain":"mistral.ai"},
    {"name":"Meta AI","desc":"Muse Spark模型聊天平台","cat":"对话助手","pricing":"免费","rating":4.2,"url":"https://meta.ai","domain":"meta.ai"},
    {"name":"Solar","desc":"Solar Pro 3模型聊天平台","cat":"对话助手","pricing":"免费","rating":4.0,"url":"https://console.upstage.ai","domain":"upstage.ai"},
    
    # === AI API ===
    {"name":"阿里云百炼","desc":"一站式大模型开发与应用构建平台","cat":"AI API","pricing":"付费","rating":4.3,"url":"https://bailian.aliyun.com","domain":"aliyun.com"},
    {"name":"Dify","desc":"开源的生成式AI应用开发平台","cat":"AI API","pricing":"免费开源/付费","rating":4.4,"url":"https://dify.ai","domain":"dify.ai"},
    {"name":"Coze","desc":"海量AI智能体免费用，一键复制同款","cat":"AI API","pricing":"免费/付费","rating":4.3,"url":"https://www.coze.com","domain":"coze.com"},
    {"name":"FastGPT","desc":"免费AI工作流搭建工具，自动化提高效率","cat":"AI API","pricing":"免费开源/付费","rating":4.2,"url":"https://fastgpt.in","domain":"fastgpt.in"},
    {"name":"SiliconFlow","desc":"生成式AI计算基础设施平台","cat":"AI API","pricing":"付费","rating":4.1,"url":"https://siliconflow.cn","domain":"siliconflow.cn"},
    {"name":"OpenRouter","desc":"AI模型API聚合平台，一个接口调用400多个模型","cat":"AI API","pricing":"付费","rating":4.4,"url":"https://openrouter.ai","domain":"openrouter.ai"},
    
    # === 数据分析 ===
    {"name":"办公小浣熊","desc":"文案生成、AI知识库创作","cat":"数据分析","pricing":"免费/付费","rating":4.0,"url":"https://www.xiaohuanxiong.com","domain":"xiaohuanxiong.com"},
    
    # === 语音识别 ===
    {"name":"讯飞听见","desc":"科大讯飞推出的在线AI语音转文字工具","cat":"语音识别","pricing":"免费/付费","rating":4.4,"url":"https://www.iflyrec.com","domain":"iflyrec.com"},
    {"name":"TurboScribe","desc":"专业AI音视频转文字工具","cat":"语音识别","pricing":"免费/付费","rating":4.3,"url":"https://turboscribe.ai","domain":"turboscribe.ai"},
]
    

def read_existing(path):
    """Read existing tools.js and extract tool names/domains."""
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Extract existing names
    existing_names = set()
    existing_domains = set()
    for m in re.finditer(r'name:"([^"]+)"', content):
        existing_names.add(m.group(1))
    for m in re.finditer(r'domain:"([^"]*)"', content):
        if m.group(1):
            existing_domains.add(m.group(1))
    return content, existing_names, existing_domains

def merge():
    tools_js_path = 'data/tools.js'
    content, existing_names, existing_domains = read_existing(tools_js_path)
    
    # Filter out duplicates (by name only)
    new_unique = []
    for t in NEW_TOOLS:
        if t['name'] not in existing_names:
            new_unique.append(t)
    
    print(f"Existing tools: ~{len(existing_names)}")
    print(f"New tools to add: {len(NEW_TOOLS)}")
    print(f"After dedup (by name): {len(new_unique)}")
    
    if not new_unique:
        print("No new tools to add!")
        return
    
    # Build tool strings
    new_lines = []
    for t in new_unique:
        parts = [f'    {{ name:"{t["name"]}"', f'desc:"{t["desc"]}"', f'cat:"{t["cat"]}"',
                 f'pricing:"{t["pricing"]}"', f'rating:{t["rating"]}', 
                 f'url:"{t["url"]}"', f'domain:"{t["domain"]}"']
        if t.get('year'):
            parts.append(f'year:{t["year"]}')
        if t.get('best'):
            parts.append(f'best:"{t["best"]}"')
        if t.get('weak'):
            parts.append(f'weak:"{t["weak"]}"')
        new_lines.append(', '.join(parts) + ' }')
    
    # Find insertion point (before the closing `];`)
    insert_pos = content.rfind('\n];')
    if insert_pos == -1:
        print("Could not find insertion point!")
        return
    
    # Add new tools with a category header comment
    spacer = ',' if content[insert_pos-1] != ',' else ''
    comment = f'\n    // === 新增工具 (来源: ai-bot.cn + fmhy.net, {datetime.now().strftime("%Y-%m-%d")}) ==='
    new_content = content[:insert_pos] + spacer + comment + '\n' + ',\n'.join(new_lines) + '\n' + content[insert_pos:]
    
    # Update timestamp
    new_content = new_content.replace(
        '// AI 工具导航 — 工具数据（自动生成，上次更新：',
        f'// AI 工具导航 — 工具数据（自动生成，上次更新：{datetime.now().strftime("%Y-%m-%d")}）'
    )
    
    with open(tools_js_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Written {len(new_unique)} new tools to {tools_js_path}")
    print(f"Total tools now: ~{len(existing_names) + len(new_unique)}")

if __name__ == '__main__':
    merge()
