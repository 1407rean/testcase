/**
 *  users表的处理函数
 */
const db = require("../../db/db");
const fs = require("fs");
const { parseJSON } = require("jquery");
// const offline = require("../../files/offLine.json");

exports.offLine = (req, res) => {
  //   res.send(req.body);

  /**
   *  查询users表
   *  消费值 consums
   *  余额 balance
   *  总消费值 total_consum
   */
  const sql_users =
    "select consums,balance,total_consum,roles,levels from users where id=?";
  db.query(sql_users, req.body.uid, (err, user_results) => {
    if (err) return res.cc(err);
    if (user_results.length != 1) return res.cc("users数据错误");
    const userjson = JSON.stringify(user_results);
    // fs.writeFileSync("offline.txt", userjson);
    console.log("old~~~~~~~~~~~~~~~~~~");

    /**
     *  用户抽奖次数
     */
    const sql_cur = "select today_num,total_num from user_gift where uid=?";
    db.query(sql_cur, req.body.uid, (err, ucur_results) => {
      if (err) return res.cc(err);
      if (ucur_results.length > 1) return res.cc("ucur数据错误");
      const ucur = JSON.stringify(ucur_results);

      /**
       *  查询back_gold表
       */
      if (req.body.order_no != "") {
        const sql_gold = "select fee from back_gold where order_no=?";
        db.query(sql_gold, req.body.order_no, (err, gold_results) => {
          if (err) return res.cc(err);
          //   if (gold_results.length != 1) return res.cc("back_gold数据错误");
          const goldjson = JSON.stringify(gold_results);
          // fs.writeFileSync("offline.txt", goldjson);

          /**
           *  查询orders表
           */
          const sql_orders =
            "select uid,business_id,goods_id,order_stat,num,goods_types_price,post_fee,goods_fee from orders where order_no=?";
          db.query(sql_orders, req.body.order_no, (err, orders_results) => {
            if (err) return res.cc(err);
            //   if (results.length != 1) return res.cc("数据错误");
            const ordersjson = JSON.stringify(orders_results);
            // fs.writeFileSync("offline.txt", ordersjson);

            const goods_id = orders_results[0].goods_id;
            const buid = orders_results[0].business_id;
            // res.send({
            //     goods_id: goods_id,
            //     buid: buid
            // })

            /**
             * goods 表
             */
            const sql_goods =
              "select business_id,name,price,stock,sales,post_fee from goods where id=?";
            db.query(sql_goods, goods_id, (err, goods_results) => {
              if (err) return res.cc(err);
              if (goods_results.length > 1) return res.cc("goods数据错误");
              const goodsjson = JSON.stringify(goods_results);
              //   fs.writeFileSync("offline.txt", goodsjson);

              /**
               *  business表
               */
              const sql_business = "select uid,name from business where id=?";
              db.query(sql_business, buid, (err, b_results) => {
                if (err) return res.cc(err);
                if (b_results.length != 1) return res.cc("business数据错误");
                const bjson = JSON.stringify(b_results);
                // fs.writeFileSync("offline.txt", bjson);

                // 商家对应的user表的uid
                let buser = b_results[0].uid;

                /**
                 *  users表 商家的uid
                 */
                const sql_busers =
                  "select consums,balance,total_consum,roles,levels from users where id=?";
                db.query(sql_busers, buser, (err, bu_results) => {
                  if (err) return res.cc(err);
                  if (bu_results.length != 1) return res.cc("buser数据错误");
                  const bujson = JSON.stringify(bu_results);

                  /**
                   *  user_friends表
                   */
                  // 直推
                  // 直推是谁
                  const sql_fid =
                    "select fid,types from user_friends where uid=?";
                  db.query(sql_fid, req.body.uid, (err, zhi_results) => {
                    if (err) return res.cc(err);
                    if (zhi_results.length > 1) return res.cc("zhi数据错误");
                    const zhijson = JSON.stringify(zhi_results);
                    if (zhi_results != "") {
                      let fuid = zhi_results[0].fid;

                      /**
                       *  直推的抽奖次数
                       */
                      db.query(sql_cur, fuid, (err, fcur_results) => {
                        if (err) return res.cc(err);
                        if (fcur_results.length > 1)
                          return res.cc("fcur数据错误");
                        const fcur = JSON.stringify(fcur_results);
                        // 直推的余额消费值
                        const Sql_zhi =
                          "select consums,balance,total_consum,roles,levels from users where id=?";
                        db.query(Sql_zhi, fuid, (err, fzhi_results) => {
                          if (err) return res.cc(err);
                          if (fzhi_results.length > 1)
                            return res.cc("fzhi数据错误");
                          const fzhi = JSON.stringify(fzhi_results);

                          /**
                           *  直推的上级three
                           */
                          db.query(sql_fid, fuid, (err, three_results) => {
                            if (err) return res.cc(err);
                            if (three_results.length > 1)
                              return res.cc("three数据错误");
                            const three = JSON.stringify(three_results);
                            if (three_results != "") {
                              let threefid = three_results[0].fid;
                              db.query(
                                Sql_zhi,
                                threefid,
                                (err, threef_results) => {
                                  if (err) return res.cc(err);
                                  if (threef_results.length > 1)
                                    return "threef数据错误";
                                  const threejson =
                                    JSON.stringify(threef_results);

                                  /**
                                   *  four
                                   */
                                  db.query(
                                    sql_fid,
                                    threefid,
                                    (err, four_results) => {
                                      if (err) return res.cc(err);
                                      if (four_results.length > 1)
                                        return res.cc("four数据错误");
                                      const four = JSON.stringify(four_results);
                                      if (four_results != "") {
                                        let fourfid = four_results[0].fid;
                                        db.query(
                                          Sql_zhi,
                                          fourfid,
                                          (err, fourf_results) => {
                                            if (err) return res.cc(err);
                                            if (fourf_results.length > 1)
                                              return "fourf数据错误";
                                            const fourjson =
                                              JSON.stringify(fourf_results);

                                            /**
                                             *  five
                                             */
                                            db.query(
                                              sql_fid,
                                              fourfid,
                                              (err, five_results) => {
                                                if (err) return res.cc(err);
                                                if (five_results.length > 1)
                                                  return res.cc("five数据错误");
                                                const five =
                                                  JSON.stringify(five_results);
                                                if (five_results != "") {
                                                  let fivefid =
                                                    five_results[0].fid;
                                                  db.query(
                                                    Sql_zhi,
                                                    fivefid,
                                                    (err, fivef_results) => {
                                                      if (err)
                                                        return res.cc(err);
                                                      if (
                                                        fivef_results.length > 1
                                                      )
                                                        return "fivef数据错误";
                                                      const fivejson =
                                                        JSON.stringify(
                                                          fivef_results
                                                        );

                                                      /**
                                                       *  six
                                                       */
                                                      db.query(
                                                        sql_fid,
                                                        fivefid,
                                                        (err, six_results) => {
                                                          if (err)
                                                            return res.cc(err);
                                                          if (
                                                            six_results.length >
                                                            1
                                                          )
                                                            return res.cc(
                                                              "six数据错误"
                                                            );
                                                          const six =
                                                            JSON.stringify(
                                                              six_results
                                                            );
                                                          if (
                                                            six_results != ""
                                                          ) {
                                                            let sixfid =
                                                              six_results[0]
                                                                .fid;
                                                            db.query(
                                                              Sql_zhi,
                                                              sixfid,
                                                              (
                                                                err,
                                                                sixf_results
                                                              ) => {
                                                                if (err)
                                                                  return res.cc(
                                                                    err
                                                                  );
                                                                if (
                                                                  sixf_results.length >
                                                                  1
                                                                )
                                                                  return "sixf数据错误";
                                                                const sixjson =
                                                                  JSON.stringify(
                                                                    sixf_results
                                                                  );

                                                                db.query(
                                                                  sql_cur,
                                                                  fuid,
                                                                  (
                                                                    err,
                                                                    fcur_results
                                                                  ) => {
                                                                    if (err)
                                                                      return res.cc(
                                                                        err
                                                                      );
                                                                    if (
                                                                      fcur_results.length >
                                                                      1
                                                                    )
                                                                      return res.cc(
                                                                        "fcur数据错误"
                                                                      );
                                                                    const fcur =
                                                                      JSON.stringify(
                                                                        fcur_results
                                                                      );

                                                                    let obj = [
                                                                      "用户:",
                                                                      userjson,
                                                                      "用户抽奖次数",
                                                                      ucur,
                                                                      "回馈金单子",
                                                                      goldjson,
                                                                      "订单状态:",
                                                                      ordersjson,
                                                                      "库存销量:",
                                                                      goodsjson,
                                                                      "商家:",
                                                                      bjson,
                                                                      "商家余额消费值:",
                                                                      bujson,
                                                                      "直推",
                                                                      zhijson,
                                                                      "直推余额消费值",
                                                                      fzhi,
                                                                      "直推的抽奖次数",
                                                                      fcur,
                                                                      "直推的上级",
                                                                      three,
                                                                      threejson,
                                                                      "four",
                                                                      four,
                                                                      fourjson,
                                                                      "five",
                                                                      five,
                                                                      fivejson,
                                                                      "six",
                                                                      six,
                                                                      sixjson,
                                                                    ];
                                                                    const Data =
                                                                      JSON.stringify(
                                                                        obj
                                                                      );
                                                                    // console.log('??');
                                                                    fs.writeFileSync(
                                                                      "offline.txt",
                                                                      Data
                                                                    );
                                                                    let data =
                                                                      JSON.parse(
                                                                        fs.readFileSync(
                                                                          "offline.txt"
                                                                        )
                                                                      );

                                                                    console.table(
                                                                      data
                                                                    );
                                                                  }
                                                                );
                                                              }
                                                            );
                                                          } else {
                                                            let obj = [
                                                              "用户:",
                                                              userjson,
                                                              "用户抽奖次数",
                                                              ucur,
                                                              "回馈金单子",
                                                              goldjson,
                                                              "订单状态:",
                                                              ordersjson,
                                                              "库存销量:",
                                                              goodsjson,
                                                              "商家:",
                                                              bjson,
                                                              "商家余额消费值:",
                                                              bujson,
                                                              "直推",
                                                              zhijson,
                                                              "直推余额消费值",
                                                              fzhi,
                                                              "直推的抽奖次数",
                                                              fcur,
                                                              "直推的上级",
                                                              three,
                                                              threejson,
                                                              "four",
                                                              four,
                                                              fourjson,
                                                              "five",
                                                              five,
                                                              fivejson,
                                                              "six",
                                                              six,
                                                            ];
                                                            const Data =
                                                              JSON.stringify(
                                                                obj
                                                              );
                                                            // console.log('??');
                                                            fs.writeFileSync(
                                                              "offline.txt",
                                                              Data
                                                            );
                                                            let data =
                                                              JSON.parse(
                                                                fs.readFileSync(
                                                                  "offline.txt"
                                                                )
                                                              );
                                                            // const o = JSON.stringify(data[15])
                                                            // const m = JSON.parse(o)
                                                            // const arr = [data[15]]

                                                            console.table(data);
                                                          }
                                                        }
                                                      );
                                                    }
                                                  );
                                                } else {
                                                  let obj = [
                                                    "用户:",
                                                    userjson,
                                                    "用户抽奖次数",
                                                    ucur,
                                                    "回馈金单子",
                                                    goldjson,
                                                    "订单状态:",
                                                    ordersjson,
                                                    "库存销量:",
                                                    goodsjson,
                                                    "商家:",
                                                    bjson,
                                                    "商家余额消费值:",
                                                    bujson,
                                                    "直推",
                                                    zhijson,
                                                    "直推余额消费值",
                                                    fzhi,
                                                    "直推的抽奖次数",
                                                    fcur,
                                                    "直推的上级",
                                                    three,
                                                    threejson,
                                                    "four",
                                                    four,
                                                    fourjson,
                                                    "five",
                                                    five,
                                                  ];
                                                  const Data =
                                                    JSON.stringify(obj);

                                                  // console.log('??');
                                                  fs.writeFileSync(
                                                    "offline.txt",
                                                    Data
                                                  );
                                                  let data = JSON.parse(
                                                    fs.readFileSync(
                                                      "offline.txt"
                                                    )
                                                  );

                                                  console.table(data);
                                                }
                                              }
                                            );
                                          }
                                        );
                                      } else {
                                        let obj = [
                                          "用户:",
                                          userjson,
                                          "用户抽奖次数",
                                          ucur,
                                          "回馈金单子",
                                          goldjson,
                                          "订单状态:",
                                          ordersjson,
                                          "库存销量:",
                                          goodsjson,
                                          "商家:",
                                          bjson,
                                          "商家余额消费值:",
                                          bujson,
                                          "直推",
                                          zhijson,
                                          "直推余额消费值",
                                          fzhi,
                                          "直推的抽奖次数",
                                          fcur,
                                          "直推的上级",
                                          three,
                                          threejson,
                                          "four",
                                          four,
                                        ];
                                        const Data = JSON.stringify(obj);

                                        // console.log('??');
                                        fs.writeFileSync("offline.txt", Data);
                                        let data = JSON.parse(
                                          fs.readFileSync("offline.txt")
                                        );

                                        console.table(data);
                                      }
                                    }
                                  );
                                }
                              );
                            } else {
                              let obj = [
                                "用户:",
                                userjson,
                                "用户抽奖次数",
                                ucur,
                                "回馈金单子",
                                goldjson,
                                "订单状态:",
                                ordersjson,
                                "库存销量:",
                                goodsjson,
                                "商家:",
                                bjson,
                                "商家余额消费值:",
                                bujson,
                                "直推",
                                zhijson,
                                "直推余额消费值",
                                fzhi,
                                "直推的抽奖次数",
                                fcur,
                                "直推的上级",
                                three,
                              ];
                              const Data = JSON.stringify(obj);

                              // console.log('??');
                              fs.writeFileSync("offline.txt", Data);
                              let data = JSON.parse(
                                fs.readFileSync("offline.txt")
                              );

                              console.table(data);
                            }
                          });
                        });
                      });
                    } else {
                      // 无直推
                      if (err) return res.cc(err);
                      if (sixf_results.length > 1) return "sixf数据错误";
                      const sixjson = JSON.stringify(sixf_results);
                      let obj = [
                        "用户:",
                        userjson,
                        "回馈金单子",
                        goldjson,
                        "订单状态:",
                        ordersjson,
                        "库存销量:",
                        goodsjson,
                        "商家:",
                        bjson,
                        "商家余额消费值:",
                        bujson,
                        "直推",
                        zhijson,
                      ];
                      const Data = JSON.stringify(obj);

                      // console.log('??');
                      fs.writeFileSync("offline.txt", Data);
                      let data = JSON.parse(fs.readFileSync("offline.txt"));

                      console.table(data);
                    }
                  });

                  //   console.log(
                  //     JSON.parse(
                  //       fs.readFile("../../files/offLine.json"),
                  //       function (err) {
                  //         if (err) return err;
                  //       }
                  //     )
                  //   );
                });
              });
            });
          });
        });
      } else {
        /**
         *  无订单
         */

        // 直推
        // 直推是谁
        const sql_fid = "select fid,types from user_friends where uid=?";
        db.query(sql_fid, req.body.uid, (err, zhi_results) => {
          if (err) return res.cc(err);
          if (zhi_results.length > 1) return res.cc("zhi数据错误");
          const zhijson = JSON.stringify(zhi_results);
          if (zhi_results != "") {
            let fuid = zhi_results[0].fid;

            /**
             *  直推的抽奖次数
             */
            db.query(sql_cur, fuid, (err, fcur_results) => {
              if (err) return res.cc(err);
              if (fcur_results.length > 1) return res.cc("fcur数据错误");
              const fcur = JSON.stringify(fcur_results);

              // 直推的余额消费值
              const Sql_zhi =
                "select consums,balance,total_consum,roles,levels from users where id=?";
              db.query(Sql_zhi, fuid, (err, fzhi_results) => {
                if (err) return res.cc(err);
                if (fzhi_results.length > 1) return res.cc("fzhi数据错误");
                const fzhi = JSON.stringify(fzhi_results);

                /**
                 *  直推的上级three
                 */
                db.query(sql_fid, fuid, (err, three_results) => {
                  if (err) return res.cc(err);
                  if (three_results.length > 1) return res.cc("three数据错误");
                  const three = JSON.stringify(three_results);
                  if (three_results != "") {
                    let threefid = three_results[0].fid;
                    db.query(Sql_zhi, threefid, (err, threef_results) => {
                      if (err) return res.cc(err);
                      if (threef_results.length > 1) return "threef数据错误";
                      const threejson = JSON.stringify(threef_results);

                      /**
                       *  four
                       */
                      db.query(sql_fid, threefid, (err, four_results) => {
                        if (err) return res.cc(err);
                        if (four_results.length > 1)
                          return res.cc("four数据错误");
                        const four = JSON.stringify(four_results);
                        if (four_results != "") {
                          let fourfid = four_results[0].fid;
                          db.query(Sql_zhi, fourfid, (err, fourf_results) => {
                            if (err) return res.cc(err);
                            if (fourf_results.length > 1)
                              return "fourf数据错误";
                            const fourjson = JSON.stringify(fourf_results);

                            /**
                             *  five
                             */
                            db.query(sql_fid, fourfid, (err, five_results) => {
                              if (err) return res.cc(err);
                              if (five_results.length > 1)
                                return res.cc("five数据错误");
                              const five = JSON.stringify(five_results);
                              if (five_results != "") {
                                let fivefid = five_results[0].fid;
                                db.query(
                                  Sql_zhi,
                                  fivefid,
                                  (err, fivef_results) => {
                                    if (err) return res.cc(err);
                                    if (fivef_results.length > 1)
                                      return "fivef数据错误";
                                    const fivejson =
                                      JSON.stringify(fivef_results);

                                    /**
                                     *  six
                                     */
                                    db.query(
                                      sql_fid,
                                      fivefid,
                                      (err, six_results) => {
                                        if (err) return res.cc(err);
                                        if (six_results.length > 1)
                                          return res.cc("six数据错误");
                                        const six = JSON.stringify(six_results);
                                        if (six_results != "") {
                                          let sixfid = six_results[0].fid;
                                          db.query(
                                            Sql_zhi,
                                            sixfid,
                                            (err, sixf_results) => {
                                              if (err) return res.cc(err);
                                              if (sixf_results.length > 1)
                                                return "sixf数据错误";
                                              const sixjson =
                                                JSON.stringify(sixf_results);
                                              let obj = [
                                                "用户:",
                                                userjson,
                                                "用户抽奖次数",
                                                ucur,
                                                "直推",
                                                zhijson,
                                                "直推余额消费值",
                                                fzhi,
                                                "直推的抽奖次数",
                                                fcur,
                                                "直推的上级",
                                                three,
                                                threejson,
                                                "four",
                                                four,
                                                fourjson,
                                                "five",
                                                five,
                                                fivejson,
                                                "six",
                                                six,
                                                sixjson,
                                              ];
                                              const Data = JSON.stringify(obj);
                                              fs.writeFileSync(
                                                "offline.txt",
                                                Data
                                              );
                                              let data = JSON.parse(
                                                fs.readFileSync("offline.txt")
                                              );

                                              console.table(data);
                                            }
                                          );
                                        } else {
                                          let obj = [
                                            "用户:",
                                            userjson,
                                            "用户抽奖次数",
                                            ucur,
                                            "直推",
                                            zhijson,
                                            "直推余额消费值",
                                            fzhi,
                                            "直推的抽奖次数",
                                            fcur,
                                            "直推的上级",
                                            three,
                                            threejson,
                                            "four",
                                            four,
                                            fourjson,
                                            "five",
                                            five,
                                            fivejson,
                                            "six",
                                            six,
                                          ];
                                          const Data = JSON.stringify(obj);
                                          fs.writeFileSync("offline.txt", Data);
                                          let data = JSON.parse(
                                            fs.readFileSync("offline.txt")
                                          );

                                          console.table(data);
                                        }
                                      }
                                    );
                                  }
                                );
                              } else {
                                let obj = [
                                  "用户:",
                                  userjson,
                                  "用户抽奖次数",
                                  ucur,
                                  "直推",
                                  zhijson,
                                  "直推余额消费值",
                                  fzhi,
                                  "直推的抽奖次数",
                                  fcur,
                                  "直推的上级",
                                  three,
                                  threejson,
                                  "four",
                                  four,
                                  fourjson,
                                  "five",
                                  five,
                                ];
                                const Data = JSON.stringify(obj);
                                fs.writeFileSync("offline.txt", Data);
                                let data = JSON.parse(
                                  fs.readFileSync("offline.txt")
                                );

                                console.table(data);
                              }
                            });
                          });
                        } else {
                          let obj = [
                            "用户:",
                            userjson,
                            "用户抽奖次数",
                            ucur,
                            "直推",
                            zhijson,
                            "直推余额消费值",
                            fzhi,
                            "直推的抽奖次数",
                            fcur,
                            "直推的上级",
                            three,
                            threejson,
                            "four",
                            four,
                          ];
                          const Data = JSON.stringify(obj);
                          fs.writeFileSync("offline.txt", Data);
                          let data = JSON.parse(fs.readFileSync("offline.txt"));

                          console.table(data);
                        }
                      });
                    });
                  } else {
                    let obj = [
                      "用户:",
                      userjson,
                      "用户抽奖次数",
                      ucur,
                      "直推",
                      zhijson,
                      "直推余额消费值",
                      fzhi,
                      "直推的抽奖次数",
                      fcur,
                      "直推的上级",
                      three,
                    ];
                    const Data = JSON.stringify(obj);
                    fs.writeFileSync("offline.txt", Data);
                    let data = JSON.parse(fs.readFileSync("offline.txt"));

                    console.table(data);
                  }
                });
              });
            });
          } else {
            let obj = [
              "用户:",
              userjson,
              "用户抽奖次数",
              ucur,
              "直推",
              zhijson,
            ];
            const Data = JSON.stringify(obj);
            fs.writeFileSync("offline.txt", Data);
            let data = JSON.parse(fs.readFileSync("offline.txt"));

            console.table(data);
          }
        });
      }
    });
  });
};
