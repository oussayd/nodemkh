var winston = require('winston');
var mongoose = require('mongoose');
var parser = require("number-parsing");
// mongoose for mongodb
mongoose.connect('mongodb://localhost:27017/amazon'); // connect to mongoDB database on modulus.io

// define model =================
var Article = mongoose.model('Article', {
    titre: String,
    asin: String,
    categorie: String,
    pays: String,
    url: String,
    prix: Number,
    indice: Number,
    img: String,
    lastUpdate: Date,
    version: Number
});






var formatter = function (args) {
    var logMessage = args.message;
    return logMessage;
};

var getAvg = function (_collection) {
    var avg = _collection.reduce(function (p, c) {
        return p + c;
    }) / _collection.length

    return avg;
};


var LIENS = {
    WAREHOUSE: {
        IT: {
            SPORT_LOISIR: {
                PAYS: 'IT',
                CATEGORIE: 'SPORT_LOISIR',
                LINK: 'http://www.amazon.it/s/ref=lp_3581999031_nr_i_4?fst=as%3Aoff&rh=i%3Asporting&bbn=3581999031&ie=UTF8&qid=1457796527'
            },
            CUISINE: {
                PAYS: 'IT',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.it/s/ref=lp_3581999031_nr_i_1?fst=as%3Aoff&rh=i%3Akitchen&bbn=3581999031&ie=UTF8&qid=1457807987'
            },

            PETIT_ELECTRO: {
                PAYS: 'IT',
                CATEGORIE: 'PETIT_ELECTRO',
                LINK: 'http://www.amazon.it/s/ref=sr_nr_n_7?fst=as%3Aoff&rh=n%3A3581999031%2Cn%3A524015031%2Cn%3A%21524016031%2Cn%3A602473031&bbn=3581999031&ie=UTF8&qid=1457302206&rnid=3581999031'
            },
            HT: {
                PAYS: 'IT',
                CATEGORIE: 'HT',
                LINK: 'http://www.amazon.it/s/ref=lp_3581999031_nr_i_0?fst=as%3Aoff&rh=i%3Aelectronics&bbn=3581999031&ie=UTF8&qid=1457800812'
            },
            BEBE: {
                PAYS: 'IT',
                CATEGORIE: 'BEBE',
                LINK: 'http://www.amazon.it/s/ref=lp_3581999031_nr_i_21?fst=as%3Aoff&rh=i%3Ababy&bbn=3581999031&ie=UTF8&qid=1457252919'
            },
            USTENSILE: {
                PAYS: 'IT',
                CATEGORIE: 'USTENSILE',
                LINK: 'http://www.amazon.it/gp/search/ref=sr_nr_n_17?fst=as%3Aoff&rh=n%3A3581999031%2Cn%3A524015031%2Cn%3A%21524016031%2Cn%3A652535031&bbn=3581999031&ie=UTF8&qid=1457796799&rnid=3581999031'
            }
        },
        FR: {
            AFFAIRES: {
                PAYS: 'FR',
                CATEGORIE: 'AFFAIRES',
                LINK: 'http://www.amazon.fr/s/ref=sr_st_price-desc-rank?rh=n%3A1325595031%2Cn%3A1325596031%2Cn%3A1849793031&me=A2CVHYRTWLQO9T&qid=1457736422&__mk_fr_FR=%C3%85M%C3%85Z%C3%95%C3%91&sort=price-desc-rank'
            },

            TELEPHONE: {
                PAYS: 'FR',
                CATEGORIE: 'TELEPHONE',
                LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_9?fst=as%3Aoff&rh=n%3A3581943031%2Cn%3A13921051%2Cn%3A%2113910671%2Cn%3A14060591&bbn=3581943031&ie=UTF8&qid=1457732256&rnid=3581943031'
            },
            BRICOLAGE: {
                PAYS: 'FR',
                CATEGORIE: 'BRICOLAGE',
                LINK: 'http://www.amazon.fr/s/ref=lp_3581943031_nr_i_5?fst=as%3Aoff&rh=i%3Adiy&bbn=3581943031&ie=UTF8&qid=1457391171'
            },
            AUTO_MOTO: {
                PAYS: 'FR',
                CATEGORIE: 'AUTO_MOTO',
                LINK: 'http://www.amazon.fr/s/ref=lp_3581943031_nr_i_19?fst=as%3Aoff&rh=i%3Aautomotive&bbn=3581943031&ie=UTF8&qid=1457391171'
            },
            SAC_CHAUSSURES: {
                PAYS: 'FR',
                CATEGORIE: 'SAC_CHAUSSURES',
                LINK: 'http://www.amazon.fr/s/rh=i%3Ashoes/ref=s9_acss_bw_ln_bosehsln_9_2?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=127G87VY0XHSTB7SFHSB&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            PETIT_ELECTRO: {
                PAYS: 'FR',
                CATEGORIE: 'PETIT_ELECTRO',
                LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_11?fst=as%3Aoff&rh=n%3A3581943031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A57696031&bbn=3581943031&ie=UTF8&qid=1457301310&rnid=3581943031'
            },

            INFORMATIQUE: {
                PAYS: 'FR',
                CATEGORIE: 'INFORMATIQUE',
                LINK: 'http://www.amazon.fr/s/rh=i%3Acomputers%2Cn%3A3581943031%2Cn%3A340858031/ref=s9_acss_bw_ln_bosehsln_6_9?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=08ASWVAGHF2VHNKH5ZKN&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            SANTE: {
                PAYS: 'FR',
                CATEGORIE: 'SANTE',
                LINK: 'http://www.amazon.fr/s/ref=lp_3581943031_nr_i_13?fst=as%3Aoff&rh=i%3Ahpc&bbn=3581943031&ie=UTF8&qid=1457248309'
            },

            MONTRES: {
                PAYS: 'FR',
                CATEGORIE: 'MONTRES',
                LINK: 'http://www.amazon.fr/s/ref=lp_3581943031_nr_i_20?fst=as%3Aoff&rh=i%3Awatches&bbn=3581943031&ie=UTF8&qid=1457248309'
            },
            BEBE: {
                PAYS: 'FR',
                CATEGORIE: 'BEBE',
                LINK: 'http://www.amazon.fr/s/rh=i%3Ababy/ref=s9_acss_bw_ln_bosehsln_8_2?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=1QX4KWEHCB7DN16H0KBQ&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            MAISON_CUISINE: {
                PAYS: 'FR',
                CATEGORIE: 'MAISON_CUISINE',
                LINK: 'http://www.amazon.fr/s/ref=lp_3581943031_nr_i_1?fst=as%3Aoff&rh=i%3Akitchen&bbn=3581943031&ie=UTF8&qid=1457219441'
            },
            BEAUTE: {
                PAYS: 'FR',
                CATEGORIE: 'BEAUTE',
                LINK: 'http://www.amazon.fr/s/rh=i%3Abeauty/ref=s9_acss_bw_ln_bosehsln_10_3?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=0M5AQFN157JERNHQZS3E&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            BIJOUX: {
                PAYS: 'FR',
                CATEGORIE: 'BIJOUX',
                LINK: 'http://www.amazon.fr/s/rh=i%3Ajewelry/ref=s9_acss_bw_ln_bosehsln_10_2?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=0P8PMECV8RWREYQTGCGA&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            TABLETTES: {
                PAYS: 'FR',
                CATEGORIE: 'TABLETTES',
                LINK: 'http://www.amazon.fr/s/rh=i%3Acomputers%2Cn%3A3581943031%2Cn%3A340858031%2Cn%3A%21340859031%2Cn%3A429882031/ref=s9_acss_bw_ln_bosehsln_6_2?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=0P8PMECV8RWREYQTGCGA&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            TEL: {
                PAYS: 'FR',
                CATEGORIE: 'BEBE',
                LINK: 'http://www.amazon.fr/s/rh=i%3Aelectronics%2Cn%3A3581943031%2Cn%3A13921051%2Cn%3A%2113910671%2Cn%3A14060661/ref=s9_acss_bw_ln_bosehsln_5_5?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=048RWJBDD2EM81ZGA20V&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            JEUX_VIDEO: {
                PAYS: 'FR',
                CATEGORIE: 'JEUX_VIDEO',
                LINK: 'http://www.amazon.fr/s/rh=i%3Avideogames%2Cn%3A3581943031%2Cn%3A530490%2Cn%3A%21548014%2Cn%3A548738/ref=s9_acss_bw_ln_bosehsln_4_2?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=1C4D9XK5G01QCZ0PBYQT&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            LUMINAIRE: {
                PAYS: 'FR',
                CATEGORIE: 'LUMINAIRE',
                LINK: 'http://www.amazon.fr/s/rh=i%3Alighting/ref=s9_acss_bw_ln_bosehsln_7_2?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=1C4D9XK5G01QCZ0PBYQT&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            AMEUBLEMENT: {
                PAYS: 'FR',
                CATEGORIE: 'AMEUBLEMENT',
                LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_0?fst=as%3Aoff&rh=n%3A3581943031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A57694031&bbn=3581943031&ie=UTF8&qid=1457248333&rnid=3581943031'
            },
            VAISSELLE: {
                PAYS: 'FR',
                CATEGORIE: 'VAISSELLE',
                LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_15?fst=as%3Aoff&rh=n%3A3581943031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A57691031&bbn=3581943031&ie=UTF8&qid=1457248333&rnid=3581943031'
            },
            RANGEMENT: {
                PAYS: 'FR',
                CATEGORIE: 'RANGEMENT',
                LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_13?fst=as%3Aoff&rh=n%3A3581943031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A2916060031&bbn=3581943031&ie=UTF8&qid=1457248333&rnid=3581943031'
            },

            COUTEAUX: {
                PAYS: 'FR',
                CATEGORIE: 'COUTEAUX',
                LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_5?fst=as%3Aoff&rh=n%3A3581943031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A57698031&bbn=3581943031&ie=UTF8&qid=1457248333&rnid=3581943031'
            },
            JOUETS: {
                PAYS: 'FR',
                CATEGORIE: 'JOUETS',
                LINK: 'http://www.amazon.fr/s/rh=i%3Atoys/ref=s9_acss_bw_ln_bosehsln_8_1?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=1C4D9XK5G01QCZ0PBYQT&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            CHAUSSURES: {
                PAYS: 'FR',
                CATEGORIE: 'CHAUSSURES',
                LINK: 'http://www.amazon.fr/s/rh=i%3Ashoes/ref=s9_acss_bw_ln_bosehsln_9_2?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=1C4D9XK5G01QCZ0PBYQT&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            HT: {
                PAYS: 'FR',
                CATEGORIE: 'HT',
                LINK: 'http://www.amazon.fr/s/ref=lp_3581943031_nr_i_2?fst=as%3Aoff&rh=i%3Aelectronics&bbn=3581943031&ie=UTF8&qid=1457248309'
            },
            SPORT_LOISIR: {
                PAYS: 'FR',
                CATEGORIE: 'SPORT_LOISIR',
                LINK: 'http://www.amazon.fr/s/rh=i%3Asports/ref=s9_acss_bw_ln_bosehsln_11_1?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=127G87VY0XHSTB7SFHSB&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            BAGAGES: {
                PAYS: 'FR',
                CATEGORIE: 'BAGAGES',
                LINK: 'http://www.amazon.fr/s/rh=i%3Aluggage/ref=s9_acss_bw_ln_bosehsln_9_3?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=127G87VY0XHSTB7SFHSB&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            },
            VETEMENTS: {
                PAYS: 'FR',
                CATEGORIE: 'VETEMENTS',
                LINK: 'http://www.amazon.fr/s/rh=i%3Aclothing/ref=s9_acss_bw_ln_bosehsln_9_1?_encoding=UTF8&bbn=3581943031&pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=merchandised-search-leftnav&pf_rd_r=127G87VY0XHSTB7SFHSB&pf_rd_t=101&pf_rd_p=598086127&pf_rd_i=3581943031'
            }

            ,
            SELECTION: {

                BEBE: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION BEBE',
                    LINK: 'http://www.amazon.fr/s/ref=lp_8873224031_nr_i_15?fst=as%3Aoff&rh=i%3Ababy&bbn=8873224031&ie=UTF8&qid=1457980645'
                },
                INFORMATIQUE: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION INFORMATIQUE',
                    LINK: 'http://www.amazon.fr/s/ref=lp_8873224031_nr_i_6?fst=as%3Aoff&rh=i%3Acomputers&bbn=8873224031&ie=UTF8&qid=1457980645'
                },
                CUISINE_AMEUBLEMENT: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION CUISINE',
                    LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_0?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A57694031&bbn=8873224031&ie=UTF8&qid=1457987762&rnid=8873224031'
                },
                CUISINE_CASSEROLES: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION CUISINE',
                    LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_3?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A2969480031&bbn=8873224031&ie=UTF8&qid=1457987762&rnid=8873224031'
                },
                CUISINE_COUTEAUX: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION CUISINE',
                    LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_5?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A57698031&bbn=8873224031&ie=UTF8&qid=1457987762&rnid=8873224031'
                },
                CUISINE_RANGEMENT: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION CUISINE',
                    LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_13?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A2916060031&bbn=8873224031&ie=UTF8&qid=1457987762&rnid=8873224031'
                },
                CUISINE_VAISSELLE: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION CUISINE',
                    LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_15?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A57691031&bbn=8873224031&ie=UTF8&qid=1457987762&rnid=8873224031'
                },
                CUISINE_PATISSERIE: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION CUISINE',
                    LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_12?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A57873031&bbn=8873224031&ie=UTF8&qid=1457987762&rnid=8873224031'
                },
                CUISINE_PETIT_ELECTRO: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION CUISINE',
                    LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_11?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A57004031%2Cn%3A%2157686031%2Cn%3A57696031&bbn=8873224031&ie=UTF8&qid=1457987762&rnid=8873224031'
                },
                MOBILE: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION MOBILE',
                    LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_10?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A13921051%2Cn%3A%2113910671%2Cn%3A14060661&bbn=8873224031&ie=UTF8&qid=1457987761&rnid=8873224031'
                },
                JEUX: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION JEUX',
                    LINK: 'http://www.amazon.fr/s/ref=lp_8873224031_nr_i_3?fst=as%3Aoff&rh=i%3Atoys&bbn=8873224031&ie=UTF8&qid=1457980645'
                },
                TELEPHONE: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION TELEPHONE',
                    LINK: 'http://www.amazon.fr/s/ref=sr_nr_n_9?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A13921051%2Cn%3A%2113910671%2Cn%3A14060591&bbn=8873224031&ie=UTF8&qid=1457987761&rnid=8873224031'
                },
                SPORT: {
                    PAYS: 'FR',
                    CATEGORIE: 'SELECTION SPORT',
                    LINK: 'http://www.amazon.fr/s/ref=lp_8873224031_nr_i_8?fst=as%3Aoff&rh=i%3Asports&bbn=8873224031&ie=UTF8&qid=1457980645'
                }


            },
        },
        UK: {
            BEBE: {
                PAYS: 'UK',
                CATEGORIE: 'BEBE',
                LINK: 'http://www.amazon.co.uk/s/ref=sr_nr_i_15?fst=as%3Aoff&rh=i%3Ababy&bbn=3581866031&sort=price-asc-rank&ie=UTF8&qid=1457205453'
            },
            ELECTRONICS: {
                PAYS: 'UK',
                CATEGORIE: 'ELECTRONICS',
                LINK: 'https://www.amazon.co.uk/s/ref=s9_acss_bw_ln_bosehsln_6_9?rh=i%3Aelectronics&bbn=3581866031&rw_html_to_wsrp=1/&pf_rd_m=A3P5ROKL5A1OLE&pf_rd_s=merchandised-search-leftnav&pf_rd_r=B6QGH38FYCRP53B3T1T9&pf_rd_t=101&pf_rd_p=755927667&pf_rd_i=3581866031'
            },
            COMPUTERS: {
                PAYS: 'UK',
                CATEGORIE: 'COMPUTERS',
                LINK: 'https://www.amazon.co.uk/s/ref=s9_acss_bw_ln_bosehsln_7_8?rh=i%3Acomputers&bbn=3581866031&rw_html_to_wsrp=1/&pf_rd_m=A3P5ROKL5A1OLE&pf_rd_s=merchandised-search-leftnav&pf_rd_r=B6QGH38FYCRP53B3T1T9&pf_rd_t=101&pf_rd_p=755927667&pf_rd_i=3581866031'
            },
            CUISINE: {
                PAYS: 'UK',
                CATEGORIE: 'CUISINE',
                LINK: 'https://www.amazon.co.uk/s/ref=s9_acss_bw_ln_bosehsln_8_7?rh=i%3Akitchen%2Cn%3A3581866031%2Cn%3A3146281%2Cn%3A11052591%2Cn%3A11052681%2Cn%3A391784011&bbn=3581866031&rw_html_to_wsrp=1/&pf_rd_m=A3P5ROKL5A1OLE&pf_rd_s=merchandised-search-leftnav&pf_rd_r=B6QGH38FYCRP53B3T1T9&pf_rd_t=101&pf_rd_p=755927667&pf_rd_i=3581866031'
            },
            JEUX: {
                PAYS: 'UK',
                CATEGORIE: 'JEUX',
                LINK: 'https://www.amazon.co.uk/s/ref=s9_acss_bw_ln_bosehsln_9_1?rh=i%3Atoys&bbn=3581866031&rw_html_to_wsrp=1/&pf_rd_m=A3P5ROKL5A1OLE&pf_rd_s=merchandised-search-leftnav&pf_rd_r=B6QGH38FYCRP53B3T1T9&pf_rd_t=101&pf_rd_p=755927667&pf_rd_i=3581866031'
            },
            BEAUTE: {
                PAYS: 'UK',
                CATEGORIE: 'BEAUTE',
                LINK: 'https://www.amazon.co.uk/s/ref=s9_acss_bw_ln_bosehsln_12_9?rh=i%3Abeauty&bbn=3581866031&rw_html_to_wsrp=1&pf_rd_m=A3P5ROKL5A1OLE&pf_rd_s=merchandised-search-leftnav&pf_rd_r=B6QGH38FYCRP53B3T1T9&pf_rd_t=101&pf_rd_p=755927667&pf_rd_i=3581866031'
            },

            PETIT_ELECTRO: {
                PAYS: 'UK',
                CATEGORIE: 'PETIT_ELECTRO',
                LINK: 'http://www.amazon.co.uk/s/ref=s9_acss_bw_ct_mpwdfc_ct4_a3?rh=i%3Akitchen%2Cn%3A3581866031%2Cn%3A3146281%2Cn%3A11052591%2Cn%3A11052681%2Cn%3A%213147411%2Cn%3A391784011%2Cn%3A3147441&bbn=3581866031&rw_html_to_wsrp=1&pf_rd_m=A3P5ROKL5A1OLE&pf_rd_s=merchandised-search-5&pf_rd_r=0SVXZNM3274EZZEZK82D&pf_rd_t=101&pf_rd_p=755927347&pf_rd_i=3581866031'
            }
        },
        DE: {
            SELECTION: {
                CUISINE: {
                    PAYS: 'DE',
                    CATEGORIE: 'SELECTION CUISINE',
                    LINK: 'http://www.amazon.de/s/ref=sr_nr_n_12?fst=as%3Aoff&rh=n%3A8872697031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3169321&bbn=8872697031&ie=UTF8&qid=1457994497&rnid=8872697031'
                },
                CUISINE_DOMESTIC_APPLIANCES: {
                    PAYS: 'DE',
                    CATEGORIE: 'SELECTION CUISINE',
                    LINK: 'http://www.amazon.de/gp/search/ref=sr_nr_n_6?fst=as%3Aoff&rh=n%3A8872697031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3169211&bbn=8872697031&ie=UTF8&qid=1457994684&rnid=8872697031'
                },
                CUISINE_TOOLS: {
                    PAYS: 'DE',
                    CATEGORIE: 'SELECTION CUISINE',
                    LINK: 'http://www.amazon.de/gp/search/ref=sr_nr_n_10?fst=as%3Aoff&rh=n%3A8872697031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3311201&bbn=8872697031&ie=UTF8&qid=1457994684&rnid=8872697031'
                },
                TELEPHONE: {
                    PAYS: 'DE',
                    CATEGORIE: 'SELECTION TELEPHONE',
                    LINK: 'http://www.amazon.de/s/ref=sr_nr_n_11?fst=as%3Aoff&rh=n%3A8872697031%2Cn%3A562066%2Cn%3A%21569604%2Cn%3A1384527031&bbn=8872697031&ie=UTF8&qid=1457994498&rnid=8872697031'
                },
                MOBILE: {
                    PAYS: 'DE',
                    CATEGORIE: 'SELECTION MOBILE',
                    LINK: 'http://www.amazon.de/s/ref=sr_nr_n_7?fst=as%3Aoff&rh=n%3A8872697031%2Cn%3A562066%2Cn%3A%21569604%2Cn%3A1384526031&bbn=8872697031&ie=UTF8&qid=1457994498&rnid=8872697031'
                }

            },
            CUISINE_BATHROOM: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_2?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A10739781&bbn=3581963031&ie=UTF8&qid=1457899221&rnid=3581963031'
            },
            CUISINE_BAKEWARE: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_1?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3311261&bbn=3581963031&ie=UTF8&qid=1457899221&rnid=3581963031   '
            },
            CUISINE_LIT: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_3?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A10176091&bbn=3581963031&ie=UTF8&qid=1457899221&rnid=3581963031'
            },
            CUISINE_CAFE: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_4?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3310781&bbn=3581963031&ie=UTF8&qid=1457899221&rnid=3581963031'
            },
            CUISINE_COOKWARE: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_5?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3094896031&bbn=3581963031&ie=UTF8&qid=1457899221&rnid=3581963031'
            },
            CUISINE_DOMESTIC_APPLIANCES: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_6?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3169211&bbn=3581963031&ie=UTF8&qid=1457899221&rnid=3581963031'
            },
            CUISINE_DECOR: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_7?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3312261&bbn=3581963031&ie=UTF8&qid=1457899221&rnid=3581963031'
            },
            CUISINE_LAUNDRY: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/gp/search/ref=sr_nr_n_11?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3437522031&bbn=3581963031&ie=UTF8&qid=1457899272&rnid=3581963031'
            },
            CUISINE_TOOLS: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/gp/search/ref=sr_nr_n_10?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3311201&bbn=3581963031&ie=UTF8&qid=1457899272&rnid=3581963031'
            },
            CUISINE_TABLE: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/gp/search/ref=sr_nr_n_13?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3312031&bbn=3581963031&ie=UTF8&qid=1457899272&rnid=3581963031'
            },
            CUISINE_IRONING: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/gp/search/ref=sr_nr_n_15?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3597047031&bbn=3581963031&ie=UTF8&qid=1457899272&rnid=3581963031'
            },

            TELEPHONE: {
                PAYS: 'DE',
                CATEGORIE: 'TELEPHONE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_11?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A562066%2Cn%3A%21569604%2Cn%3A1384527031&bbn=3581963031&ie=UTF8&qid=1457899224&rnid=3581963031'
            },

            MOBILE: {
                PAYS: 'DE',
                CATEGORIE: 'MOBILE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_7?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A562066%2Cn%3A%21569604%2Cn%3A1384526031&bbn=3581963031&ie=UTF8&qid=1457899224&rnid=3581963031'
            },
            COMPUTERS: {
                PAYS: 'DE',
                CATEGORIE: 'COMPUTERS',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_3?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A562066%2Cn%3A%21569604%2Cn%3A1626220031&bbn=3581963031&ie=UTF8&qid=1457899224&rnid=3581963031'
            },

            BEBE: {
                PAYS: 'DE',
                CATEGORIE: 'BEBE',
                LINK: 'http://www.amazon.de/s/ref=lp_3581963031_nr_i_17?fst=as%3Aoff&rh=i%3Ababy&bbn=3581963031&ie=UTF8&qid=1457222604'
            },
            COOKWARE: {
                PAYS: 'DE',
                CATEGORIE: 'COOKWARE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_5?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3094896031&bbn=3581963031&ie=UTF8&qid=1457222962&rnid=3581963031'
            },
            CUISINE: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_10?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3311201&bbn=3581963031&ie=UTF8&qid=1457223000&rnid=3581963031'
            },
            CUISINE_TABLEWARE: {
                PAYS: 'DE',
                CATEGORIE: 'CUISINE',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_n_14?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A%213169011%2Cn%3A3310821&bbn=3581963031&sort=price-desc-rank&ie=UTF8&qid=1457247567&rnid=3581963031'
            },
            TOYS: {
                PAYS: 'DE',
                CATEGORIE: 'TOYS',
                LINK: 'http://www.amazon.de/s/ref=sr_nr_p_72_0?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A12950651%2Cp_72%3A184746031&bbn=3581963031&ie=UTF8&qid=1457246025&rnid=184724031'
            },
            JUS: {
                PAYS: 'DE',
                CATEGORIE: 'JUS',
                LINK: 'http://www.amazon.de/s/ref=sr_st_price-desc-rank?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A3167641%2Cn%3A!3169011%2Cn%3A3169321%2Cn%3A332089011&qid=1457266674&bbn=3581963031&sort=price-desc-rank'
            },
            CHAUSSURES: {
                PAYS: 'DE',
                CATEGORIE: 'CHAUSSURES',
                LINK: 'http://www.amazon.de/gp/search/ref=sr_nr_n_4?fst=as%3Aoff&rh=n%3A3581963031%2Cn%3A355006011%2Cn%3A%21361139011%2Cn%3A1760296031%2Cn%3A1760304031&bbn=3581963031&ie=UTF8&qid=1457246225&rnid=3581963031'
            }
        }
    }

};


describe('Amazon traking warehouse selection DE', function () {

    beforeAll(function () {
        browser.ignoreSynchronization = true;

        browser.driver.manage().window().setSize(1280, 1440);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;

    });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;
    });

    it('tacking selection CUISINE', function () {

        search(LIENS.WAREHOUSE.DE.SELECTION.CUISINE);

    });
    it('tacking selection CUISINE_DOMESTIC_APPLIANCES', function () {

        search(LIENS.WAREHOUSE.DE.SELECTION.CUISINE_DOMESTIC_APPLIANCES);

    });
    it('tacking selection CUISINE_DOMESTIC_APPLIANCES', function () {

        search(LIENS.WAREHOUSE.DE.SELECTION.CUISINE_DOMESTIC_APPLIANCES);

    });
    it('tacking selection MOBILE', function () {

        search(LIENS.WAREHOUSE.DE.SELECTION.MOBILE);

    });
    it('tacking selection CUISINE_TOOLS', function () {

        search(LIENS.WAREHOUSE.DE.SELECTION.CUISINE_TOOLS);

    });
});


xdescribe('Amazon traking warehouse selection FR 2', function () {

    beforeAll(function () {
        browser.ignoreSynchronization = true;

        browser.driver.manage().window().setSize(1280, 1440);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;

    });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;
    });

    it('tacking selection SPORT', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.SPORT);

    });
    it('tacking selection TELEPHONE', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.TELEPHONE);

    });
    it('tacking selection MOBILE', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.MOBILE);

    });
    it('tacking selection JEUX', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.JEUX);

    });
});


xdescribe('Amazon traking warehouse selection FR', function () {

    beforeAll(function () {
        browser.ignoreSynchronization = true;

        browser.driver.manage().window().setSize(1280, 1440);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;

    });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;
    });

    it('tacking selection bebe', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.BEBE);

    });
    it('tacking selection CUISINE_AMEUBLEMENT', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.CUISINE_AMEUBLEMENT);

    });
    it('tacking selection CUISINE_CASSEROLES', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.CUISINE_CASSEROLES);

    });
    it('tacking selection CUISINE_COUTEAUX', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.CUISINE_COUTEAUX);

    });
    it('tacking selection CUISINE_PATISSERIE', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.CUISINE_PATISSERIE);

    });
    it('tacking selection CUISINE_PETIT_ELECTRO', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.CUISINE_PETIT_ELECTRO);

    });
    it('tacking selection CUISINE_RANGEMENT', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.CUISINE_RANGEMENT);

    });

    it('tacking selection CUISINE_VAISSELLE', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.CUISINE_VAISSELLE);

    });

    it('tacking selection INFORMATIQUE', function () {

        search(LIENS.WAREHOUSE.FR.SELECTION.INFORMATIQUE);

    });
});


xdescribe('Amazon traking warehouse FR', function () {

    beforeAll(function () {
        browser.ignoreSynchronization = true;

        browser.driver.manage().window().setSize(1280, 1440);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;

    });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;
    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.AFFAIRES);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.TELEPHONE);

    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.AMEUBLEMENT);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.AUTO_MOTO);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.BAGAGES);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.BEAUTE);

    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.BIJOUX);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.BRICOLAGE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.CHAUSSURES);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.COUTEAUX);

    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.HT);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.INFORMATIQUE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.JEUX_VIDEO);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.JOUETS);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.LUMINAIRE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.MAISON_CUISINE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.MONTRES);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.PETIT_ELECTRO);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.RANGEMENT);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.SAC_CHAUSSURES);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.SANTE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.SPORT_LOISIR);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.TABLETTES);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.TEL);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.FR.VETEMENTS);

    });


    it('tacking ' + LIENS.WAREHOUSE.FR.BEBE.CATEGORIE + '.' + LIENS.WAREHOUSE.FR.BEBE.PAYS, function () {

        search(LIENS.WAREHOUSE.FR.BEBE);

    });

});


describe('Amazon traking warehouse DE', function () {

    beforeAll(function () {
        browser.ignoreSynchronization = true;

        browser.driver.manage().window().setSize(1280, 1440);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;

    });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;
    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_BAKEWARE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_BATHROOM);

    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_CAFE);

    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_COOKWARE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_DECOR);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_DOMESTIC_APPLIANCES);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_IRONING);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_LAUNDRY);

    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_LIT);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_TABLE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE_TOOLS);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.TELEPHONE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.MOBILE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.COMPUTERS);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CHAUSSURES);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.COOKWARE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.CUISINE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.MONTRES);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.TABLEWARE);

    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.DE.TOYS);

    });



    it('tacking ' + LIENS.WAREHOUSE.DE.BEBE.CATEGORIE + '.' + LIENS.WAREHOUSE.DE.BEBE.PAYS, function () {

        search(LIENS.WAREHOUSE.DE.BEBE);

    });


});


describe('Amazon traking warehouse IT', function () {

    beforeAll(function () {
        browser.ignoreSynchronization = true;

        browser.driver.manage().window().setSize(1280, 1440);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;

    });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;
    });
    it('tacking ', function () {

        search(LIENS.WAREHOUSE.IT.SPORT_LOISIR);

    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.IT.CUISINE);

    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.IT.HT);

    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.IT.USTENSILE);

    });

    it('tacking ', function () {

        search(LIENS.WAREHOUSE.IT.PETIT_ELECTRO);

    });

    it('tacking ' + LIENS.WAREHOUSE.IT.BEBE.CATEGORIE + '.' + LIENS.WAREHOUSE.IT.BEBE.PAYS, function () {

        search(LIENS.WAREHOUSE.IT.BEBE);

    });

});


describe('Amazon traking warehouse UK', function () {

    beforeAll(function () {
        browser.ignoreSynchronization = true;

        browser.driver.manage().window().setSize(1280, 1440);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;

    });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;
    });


    it('tacking UK.CUISINE', function () {
        search(LIENS.WAREHOUSE.UK.CUISINE);
    });
    it('tacking UK.JEUX', function () {
        search(LIENS.WAREHOUSE.UK.JEUX);
    });
    it('tacking UK.ELECTRONICS', function () {
        search(LIENS.WAREHOUSE.UK.ELECTRONICS);
    });
    it('tacking UK.BEAUTE', function () {
        search(LIENS.WAREHOUSE.UK.BEAUTE);
    });
    it('tacking ', function () {
        search(LIENS.WAREHOUSE.UK.PETIT_ELECTRO);
    });

    it('tacking ' + LIENS.WAREHOUSE.UK.BEBE.CATEGORIE + '.' + LIENS.WAREHOUSE.UK.BEBE.PAYS, function () {
        search(LIENS.WAREHOUSE.UK.BEBE);
    });

});

var search = function (_cible) {
    var filename;
    var _link = _cible.LINK;
    var _filename = _cible.CATEGORIE + '.' + _cible.PAYS;
    var loggerHTML = new(winston.Logger)({
        transports: [
      new(winston.transports.File)({
                json: false,
                filename: 'export/' + _filename + '.html',
                formatter: formatter
            })
    ]
    });
    var loggerCSV = new(winston.Logger)({
        transports: [
         new(winston.transports.Console)(),
         new(winston.transports.File)({
                json: false,
                filename: 'export/' + _filename + '.csv',
                formatter: formatter
            })
    ]
    });

    if (_link.indexOf('amazon.fr') > -1) {
        baseUrl = 'http://www.amazon.fr/gp/offer-listing/';
    } else if (_link.indexOf('amazon.co.uk') > -1) {
        baseUrl = 'http://www.amazon.co.uk/gp/offer-listing/';
    } else if (_link.indexOf('amazon.de') > -1) {
        baseUrl = 'http://www.amazon.de/gp/offer-listing/';
    } else if (_link.indexOf('amazon.it') > -1) {
        baseUrl = 'http://www.amazon.it/gp/offer-listing/';
    }
    browser.driver.get(_link);

    var pageIndex = 1;
    //  element(by.cssContainingText('option', 'Price: High to Low')).click();
    element(by.css('select#sort option:nth-child(3)')).click();
    browser.driver.sleep(2000);

    var pRef = [];
    var reduction = 100;


    var nextPage = function () {


        //  browser.driver.sleep(1000);
        element.all(by.css('#s-results-list-atf li')).each(function (element, index) {

            element.element(by.css('.a-color-price')).getText().then(function (text) {


                    var prix;
                    var img;
                    if (text.indexOf('£') > -1) {
                        prix = parser(text.replace(/[^\d^,^.]/g, ''), {
                            us: 0.75,
                            fr: 0.25
                        });
                    } else {
                        prix = parser(text.replace(/[^\d^,^.]/g, ''));

                    }

                    if (pRef.length > 0) {
                        reduction = 100 * prix / getAvg(pRef);
                    } else {
                        reduction = 100;

                    }

                    pRef.push(prix);
                    if (pRef.length > 10) {
                        pRef.shift();
                    }


                    /*    var msg = '"' + (i++) + '";"' + prix.replace('.', ',') + '";"' + reduction.toFixed(0);*/
                    element.element(by.css('img')).getAttribute('src').then(function (text) {
                            img = text;

                            element.getAttribute('data-asin').then(function (asin) {

                                element.element(by.css('h2')).getText().then(function (titre) {

                                    Article.findOne({
                                        asin: asin,
                                        pays: _cible.PAYS,
                                        prix: prix
                                    }, function (err, article) {


                                        if (!article) {
                                            Article.update({
                                                    asin: asin,
                                                    pays: _cible.PAYS
                                                }, {
                                                    titre: titre,
                                                    asin: asin,
                                                    categorie: _cible.CATEGORIE,
                                                    pays: _cible.PAYS,
                                                    url: baseUrl + asin + '/',
                                                    prix: prix,
                                                    indice: reduction.toFixed(2),
                                                    img: img,
                                                    lastUpdate: Date.now(),
                                                    $inc: {
                                                        version: 1
                                                    },
                                                }, {
                                                    upsert: true
                                                },
                                                function (err, article) {
                                                    if (err)
                                                        console.log(err);

                                                });
                                        }
                                    });



                                });
                            });


                        },
                        function (err) {

                        });
                },
                function (err) {});

        });


        browser.executeScript('window.scrollTo(0,document.body.scrollHeight)').then(function () {
            browser.driver.sleep(100);

            browser.executeScript('window.scrollTo(0,document.body.scrollHeight)').then(function () {
                browser.driver.sleep(100);

                element(by.id('pagnNextLink')).isPresent().then(function (isPresent) {
                    if (isPresent) {
                        pageIndex++
                        if (pageIndex % 10 === 0) {
                            console.log(_filename + 'Page ' + pageIndex++);
                        }
                        element(by.id('pagnNextLink')).click();
                        nextPage(); // next page

                    } else {
                        console.log(_filename + " Last Page");
                        return; // the element is not enabled, last page


                    }
                }, function (error) {
                    console.log(_filename + " Last Page");
                });
            });
        });

    };

    nextPage();

}