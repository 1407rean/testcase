/**
 *  users表的处理函数
 */
const db = require("../../db/db");
const fs = require("fs");
// const offline = require("../../files/offLine.json");

exports.later = (req, res) => {
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
    // fs.writeFileSync("later.txt", userjson);

    /**
     *  查询back_gold表
     */
    if (req.body.order_no != "") {
      const sql_gold = "select fee from back_gold where order_no=?";
      db.query(sql_gold, req.body.order_no, (err, gold_results) => {
        if (err) return res.cc(err);
        //   if (gold_results.length != 1) return res.cc("back_gold数据错误");
        const goldjson = JSON.stringify(gold_results);
        // fs.writeFileSync("later.txt", goldjson);

        /**
         *  查询orders表
         */
        const sql_orders =
          "select uid,business_id,goods_id,order_stat,num,goods_types_price,post_fee,goods_fee from orders where order_no=?";
        db.query(sql_orders, req.body.order_no, (err, orders_results) => {
          if (err) return res.cc(err);
          //   if (results.length != 1) return res.cc("数据错误");
          const ordersjson = JSON.stringify(orders_results);
          // fs.writeFileSync("later.txt", ordersjson);

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
            if (goods_results.length != 1) return res.cc("goods数据错误");
            const goodsjson = JSON.stringify(goods_results);
            //   fs.writeFileSync("later.txt", goodsjson);

            /**
             *  business表
             */
            const sql_business = "select uid,name from business where id=?";
            db.query(sql_business, buid, (err, b_results) => {
              if (err) return res.cc(err);
              if (b_results.length != 1) return res.cc("business数据错误");
              const bjson = JSON.stringify(b_results);
              // fs.writeFileSync("later.txt", bjson);

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
                    // 直推的余额消费值
                    const Sql_zhi =
                      "select consums,balance,total_consum from users where id=?";
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
                          db.query(Sql_zhi, threefid, (err, threef_results) => {
                            if (err) return res.cc(err);
                            if (threef_results.length > 1)
                              return "threef数据错误";
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
                                                    return res.cc(
                                                      "six数据错误"
                                                    );
                                                  const six =
                                                    JSON.stringify(six_results);
                                                  if (six_results != "") {
                                                    let sixfid =
                                                      six_results[0].fid;
                                                    db.query(
                                                      Sql_zhi,
                                                      sixfid,
                                                      (err, sixf_results) => {
                                                        if (err)
                                                          return res.cc(err);
                                                        if (
                                                          sixf_results.length >
                                                          1
                                                        )
                                                          return "sixf数据错误";
                                                        const sixjson =
                                                          JSON.stringify(
                                                            sixf_results
                                                          );
                                                        let obj = [
                                                          "用户:",
                                                          userjson,
                                                          bujson,
                                                          "直推",
                                                          zhijson,
                                                          "直推余额消费值",
                                                          fzhi,
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
                                                          JSON.stringify(obj);
                                                        fs.writeFileSync(
                                                          "later.txt",
                                                          Data
                                                        );
                                                        let data = JSON.parse(
                                                          fs.readFileSync(
                                                            "later.txt"
                                                          )
                                                        );
                                                        let old = JSON.parse(
                                                          fs.readFileSync(
                                                            "offline.txt"
                                                          )
                                                        )
                                                        ;

                                                        console.table(data);
                                                      }
                                                    );
                                                  } else {
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
                                                      "直推余额消费值",
                                                      fzhi,
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
                                                      JSON.stringify(obj);
                                                    fs.writeFileSync(
                                                      "later.txt",
                                                      Data
                                                    );
                                                    let data = JSON.parse(
                                                      fs.readFileSync(
                                                        "later.txt"
                                                      )
                                                    );
                                                    // let old = JSON.parse(
                                                    //   fs.readFileSync(
                                                    //     "offline.txt"
                                                    //   )
                                                    // );
                                                    // const diff_fee = data[3].fee
                                                    // const diff_stock = old[7].stock - data[7].stock
                                                    // const diff_sales = data[7].sales - old[7].sales
                                                    // const diff_bconsum = data[11].consums - old[11].consums
                                                    // const diss_byu = data[11].balance - old[11].balance
                                                    // const diss_btotal = data[11].total_consum - old[11].total_consum
                                                    // const diss_zhic = data[15].consums - old[15].consums
                                                    // const diss_zhib = data[15].balance - old[15].balance
                                                    // const diss_zhit = data[15].total_consum - old[15].total_consum


                                                    // const diss_threec = data[18].consums - old[18].consums
                                                    // const diss_threeb = data[18].balance - old[18].balance
                                                    // const diss_threet = data[18].total_consum - old[18].total_consum


                                                    // const diss_fourc = data[21].consums - old[21].consums
                                                    // const diss_fourb = data[21].balance - old[21].balance
                                                    // const diss_fourt = data[21].total_consum - old[21].total_consum


                                                    // const diss_fivec = data[24].consums - old[24].consums
                                                    // const diss_fiveb = data[24].balance - old[24].balance
                                                    // const diss_fivet = data[24].total_consum - old[24].total_consum


                                                 // const diss_sixc = data[27].consums - old[27].consums
                                                    // const diss_sixb = data[27].balance - old[27].balance
                                                    // const diss_sixt = data[27].total_consum - old[27].total_consum

                                                    // const diff = 


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
                                          fs.writeFileSync("later.txt", Data);
                                          let data = JSON.parse(
                                            fs.readFileSync("later.txt")
                                          );
                                          let old = JSON.parse(
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
                                  "直推的上级",
                                  three,
                                  threejson,
                                  "four",
                                  four,
                                ];
                                const Data = JSON.stringify(obj);
                                fs.writeFileSync("later.txt", Data);
                                let data = JSON.parse(
                                  fs.readFileSync("later.txt")
                                );
                                let old = JSON.parse(
                                  fs.readFileSync("offline.txt")
                                )
                                ;

                                console.table(data);
                              }
                            });
                          });
                        } else {
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
                            "直推余额消费值",
                            fzhi,
                            "直推的上级",
                            three,
                          ];
                          const Data = JSON.stringify(obj);
                          fs.writeFileSync("later.txt", Data);
                          let data = JSON.parse(fs.readFileSync("later.txt"));

                          console.table(data[0]);
                        }
                      });
                    });
                  } else {
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
                    fs.writeFileSync("later.txt", Data);
                    let data = JSON.pars;
                    let old = JSON.parse(fs.readFileSync("offline.txt"));
                   
                    e(fs.readFileSync("later.txt"));

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
      // 直推
      // 直推是谁
      const sql_fid = "select fid,types from user_friends where uid=?";
      db.query(sql_fid, req.body.uid, (err, zhi_results) => {
        if (err) return res.cc(err);
        if (zhi_results.length > 1) return res.cc("zhi数据错误");
        const zhijson = JSON.stringify(zhi_results);
        if (zhi_results != "") {
          let fuid = zhi_results[0].fid;
          // 直推的余额消费值
          const Sql_zhi =
            "select consums,balance,total_consum from users where id=?";
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
                    if (four_results.length > 1) return res.cc("four数据错误");
                    const four = JSON.stringify(four_results);
                    if (four_results != "") {
                      let fourfid = four_results[0].fid;
                      db.query(Sql_zhi, fourfid, (err, fourf_results) => {
                        if (err) return res.cc(err);
                        if (fourf_results.length > 1) return "fourf数据错误";
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
                            db.query(Sql_zhi, fivefid, (err, fivef_results) => {
                              if (err) return res.cc(err);
                              if (fivef_results.length > 1)
                                return "fivef数据错误";
                              const fivejson = JSON.stringify(fivef_results);

                              /**
                               *  six
                               */
                              db.query(sql_fid, fivefid, (err, six_results) => {
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
                                        "直推",
                                        zhijson,
                                        "直推余额消费值",
                                        fzhi,
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
                                      fs.writeFileSync("later.txt", Data);
                                      let data = JSON.parse(
                                        fs.readFileSync("later.txt")
                                      );
                                      let old = JSON.parse(
                                        fs.readFileSync("offline.txt")
                                      );


                                      console.table(data);
                                    }
                                  );
                                } else {
                                  let obj = [
                                    "用户:",
                                    userjson,
                                    "直推",
                                    zhijson,
                                    "直推余额消费值",
                                    fzhi,
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
                                  fs.writeFileSync("later.txt", Data);
                                  let data = JSON.parse(
                                    fs.readFileSync("later.txt")
                                  );
                                  let old = JSON.parse(
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
                              "直推",
                              zhijson,
                              "直推余额消费值",
                              fzhi,
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
                            fs.writeFileSync("later.txt", Data);
                            let data = JSON.parse(fs.readFileSync("later.txt"));
                            let old = JSON.parse(
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
                        "直推",
                        zhijson,
                        "直推余额消费值",
                        fzhi,
                        "直推的上级",
                        three,
                        threejson,
                        "four",
                        four,
                      ];
                      const Data = JSON.stringify(obj);
                      fs.writeFileSync("later.txt", Data);
                      let data = JSON.pars;
                      let old = JSON.parse(fs.readFileSync("offline.txt"));
                     
                      e(fs.readFileSync("later.txt"));

                      console.table(data);
                    }
                  });
                });
              } else {
                let obj = [
                  "用户:",
                  userjson,
                  "直推",
                  zhijson,
                  "直推余额消费值",
                  fzhi,
                  "直推的上级",
                  three,
                ];
                const Data = JSON.stringify(obj);
                fs.writeFileSync("later.txt", Data);
                let data = JSON.pars;
                let old = JSON.parse(fs.readFileSync("offline.txt"));
               
                e(fs.readFileSync("later.txt"));

                console.table(data);
              }
            });
          });
        } else {
          if (err) return res.cc(err);
          if (sixf_results.length > 1) return "sixf数据错误";
          const sixjson = JSON.stringify(sixf_results);
          let obj = ["用户:", userjson, "直推", zhijson];
          const Data = JSON.stringify(obj);
          fs.writeFileSync("later.txt", Data);
          let data = JSON.pars;
          let old = JSON.parse(fs.readFileSync("offline.txt"));
         
          e(fs.readFileSync("later.txt"));

          console.table(data);
        }
      });
    }
  });
};
