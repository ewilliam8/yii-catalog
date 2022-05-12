<?php

namespace app\controllers; 


class CatalogController extends AppController {

    public function actionIndex ()
    {
        // http://catalog.test/web/catalog
        $this->layout = 'empty';
        $this->view->title = 'Catalog Task';

        return $this->render('index');
    }
}