
function contrastText(op) {
    if (!op) {
        return op;
    }
    if (!op.eq_min) {
        op.eq_min = 3;
    }
    if (!op.eq_index) {
        op.eq_index = 5;
    }
    if (!op.value1 || !op.value2) {
        return op;
    }
    var ps = {
        v1_i: 0,
        v1_new_value: "",
        v2_i: 0,
        v2_new_value: ""
    };
    while (ps.v1_i < op.value1.length && ps.v2_i < op.value2.length) {
        if (op.value1[ps.v1_i] == op.value2[ps.v2_i]) {
            //ps.v1_new_value += op.value1[ps.v1_i].replace(/</g,"<").replace(">",">");
            ps.v2_new_value += op.value2[ps.v2_i]
                .replace(/</g, "<")
                .replace(">", ">");
            ps.v1_i += 1;
            ps.v2_i += 1;
            //值2增加的部分
            if (ps.v1_i >= op.value1.length) {
                ps.v2_new_value +=
                    "<del style='color:red'>" +
                    op.value2
                        .substr(ps.v2_i)
                        .replace(/</g, "<")
                        .replace(">", ">") +
                    "</del>";
                break;
            }
            //值1删除的部分
            if (ps.v2_i >= op.value2.length) {
                //ps.v1_new_value += "<span style='" + op.value1_style + "'>值1多的" + op.value1.substr(ps.v1_i).replace(/</g,"<").replace(">",">") + "</span>";
                ps.v2_new_value +=
                    "<span style='color:green'>" +
                    op.value1
                        .substr(ps.v1_i)
                        .replace(/</g, "<")
                        .replace(">", ">") +
                    "</span>";
                break;
            }
        } else {
            ps.v1_index = ps.v1_i + 1;
            ps.v1_eq_length = 0;
            ps.v1_eq_max = 0;
            ps.v1_start = ps.v1_i + 1;
            while (ps.v1_index < op.value1.length) {
                if (
                    op.value1[ps.v1_index] == op.value2[ps.v2_i + ps.v1_eq_length]
                ) {
                    ps.v1_eq_length += 1;
                } else if (ps.v1_eq_length > 0) {
                    if (ps.v1_eq_max < ps.v1_eq_length) {
                        ps.v1_eq_max = ps.v1_eq_length;
                        ps.v1_start = ps.v1_index - ps.v1_eq_length;
                    }
                    ps.v1_eq_length = 0;
                    break; //只寻找最近的
                }
                ps.v1_index += 1;
            }
            if (ps.v1_eq_max < ps.v1_eq_length) {
                ps.v1_eq_max = ps.v1_eq_length;
                ps.v1_start = ps.v1_index - ps.v1_eq_length;
            }

            ps.v2_index = ps.v2_i + 1;
            ps.v2_eq_length = 0;
            ps.v2_eq_max = 0;
            ps.v2_start = ps.v2_i + 1;
            while (ps.v2_index < op.value2.length) {
                if (
                    op.value2[ps.v2_index] == op.value1[ps.v1_i + ps.v2_eq_length]
                ) {
                    ps.v2_eq_length += 1;
                } else if (ps.v2_eq_length > 0) {
                    if (ps.v2_eq_max < ps.v2_eq_length) {
                        ps.v2_eq_max = ps.v2_eq_length;
                        ps.v2_start = ps.v2_index - ps.v2_eq_length;
                    }
                    ps.v1_eq_length = 0;
                    break; //只寻找最近的
                }
                ps.v2_index += 1;
            }
            if (ps.v2_eq_max < ps.v2_eq_length) {
                ps.v2_eq_max = ps.v2_eq_length;
                ps.v2_start = ps.v2_index - ps.v2_eq_length;
            }
            if (
                ps.v1_eq_max < op.eq_min &&
                ps.v1_start - ps.v1_i > op.eq_index
            ) {
                ps.v1_eq_max = 0;
            }
            if (
                ps.v2_eq_max < op.eq_min &&
                ps.v2_start - ps.v2_i > op.eq_index
            ) {
                ps.v2_eq_max = 0;
            }
            if (ps.v1_eq_max == 0 && ps.v2_eq_max == 0) {
                //两个值的字不同
                //ps.v1_new_value += "<span style='" + op.value1_style + "'>不同的" + op.value1[ps.v1_i].replace(/</g,"<").replace(">",">") + "</span>";
                ps.v2_new_value +=
                    "<span style='color:green'>" +
                    op.value1[ps.v1_i].replace(/</g, "<").replace(">", ">") +
                    "</span>";
                ps.v2_new_value +=
                    "<del style='color:red'>" +
                    op.value2[ps.v2_i].replace(/</g, "<").replace(">", ">") +
                    "</del>";
                ps.v1_i += 1;
                ps.v2_i += 1;

                if (ps.v1_i >= op.value1.length) {
                    //值2增加的部分
                    ps.v2_new_value +=
                        "<del style='color:red'>" +
                        op.value2
                            .substr(ps.v2_i)
                            .replace(/</g, "<")
                            .replace(">", ">") +
                        "</del>";
                    break;
                }
                if (ps.v2_i >= op.value2.length) {
                    //值1删除的部分
                    //ps.v1_new_value += "<span style='" + op.value1_style + "'>值1多的" + op.value1.substr(ps.v1_i).replace(/</g,"<").replace(">",">") + "</span>";
                    ps.v2_new_value +=
                        "<span style='color:green'>" +
                        op.value1
                            .substr(ps.v1_i)
                            .replace(/</g, "<")
                            .replace(">", ">") +
                        "</span>";
                    break;
                }
                //值1删除的
            } else if (ps.v1_eq_max > ps.v2_eq_max) {
                //ps.v1_new_value += "<span style='" + op.value1_style + "'>值1删除的" + op.value1.substr(ps.v1_i, ps.v1_start - ps.v1_i).replace(/</g,"<").replace(">",">") + "</span>";
                ps.v2_new_value +=
                    "<span style='color:green'>" +
                    op.value1
                        .substr(ps.v1_i, ps.v1_start - ps.v1_i)
                        .replace(/</g, "<")
                        .replace(">", ">") +
                    "</span>";
                ps.v1_i = ps.v1_start;
            } else {
                //值2增加的
                ps.v2_new_value +=
                    "<del style='color:red'>" +
                    op.value2
                        .substr(ps.v2_i, ps.v2_start - ps.v2_i)
                        .replace(/</g, "<")
                        .replace(">", ">") +
                    "</del>";
                ps.v2_i = ps.v2_start;
            }
        }
    }
    op.value1 = ps.v1_new_value;
    op.value2 = ps.v2_new_value;
    //有多个连着修改的放在一起
    var addRule = /<del style='color:red'>((?!<del).)+<\/del>/g;
    var deleteRule = /<span style='color:green'>((?!<span).)+<\/span>/g;
    var allRule = /(<span style='color:green'>((?!<span).)+<\/span><del style='color:red'>((?!<del).)+<\/del>){2,}/g;
    op.value2 = op.value2.replace(allRule, function (str) {
        var beforText = "",
            afterText = "";
        var beforeMatch = str.match(deleteRule);
        for (var i = 0; i < beforeMatch.length; i++) {
            var m = beforeMatch[i].match(deleteRule);
            beforText += RegExp.$1;
        }
        var afterMatch = str.match(addRule);
        for (var i = 0; i < afterMatch.length; i++) {
            var m = afterMatch[i].match(addRule);
            afterText += RegExp.$1;
        }
        return (
            "<span style='color:green'>" +
            beforText +
            "</span><del style='color:red'>" +
            afterText +
            "</del>"
        );
    });
    return op;
}

layui.use(["jquery"], function () {
     var $ = layui.$
    //底部二维码显示
       $(".wx-btn").hover(function(){
            $(".ewm").stop(true, true).slideDown(300);
        },function(){
            $(".ewm").stop(true, true).fadeOut(300);
        })

    // 返回顶部
        $(".go-top-click").click(function(){
        $('body,html').animate({ scrollTop: 0 }, 1000);
    })


     window.onscroll=function(){
         if ($(document).scrollTop() > $("#header").height()){
             $("#header").addClass('header-hover');
         }else{
             $("#header").removeClass('header-hover');
         }
     }
})
