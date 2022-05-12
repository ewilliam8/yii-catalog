<?php
    use app\assets\AppAsset;
    use yii\helpers\Html;
    AppAsset::register($this);
?>
<?php $this->beginPage() ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->registerCsrfMetaTags() ?>
    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> -->
    <?php $this->head() ?>
</head>

<body>
    <?php $this->beginBody() ?>
    <?= $content ?>

    <div class="d-flex justify-content-center w-100 p-3">
        <nav class="navbar navbar-light bg-light">
            <div class="user">
                <input class="form-control mr-sm-2" id="search" type="search" placeholder="Search username" aria-label="Search">
            </div>
            <div class="user">
                <button class="btn btn-outline-success my-2 my-sm-0" id="choose_btn" onclick="getUserInfo()">Выбрать</button>
            </div>
            <div class="user">
                <button class="btn btn-outline-success my-2 my-sm-0" onclick="clear_choose()">Очистить</button>
            </div>
            <div class="user" onclick="saveUserInfo()">
                <button class="btn btn-outline-success my-2 my-sm-0">Сохранить</button>
            </div>
        </nav>
    </div>

    <div class="d-flex justify-content-center">
    <!-- border border-primary rounded -->
        <div class="form-select w-25 p-3 border border-light rounded" size="3" aria-label="size 3 select example" id="catalog">
            <h2>Профили не найдены</h2>
            <p>Возможно, произошла ошибка на сервере, или профиля ещё не добавлены.</p>
        </div> 
        <div style="width: 25px;"></div>
        <div class="form-select w-25 p-3 border border-light rounded" size="3" aria-label="size 3 select example" id="choose">
            <h2>Выберите направление</h2>
            <p>В левой колонке нажмите на напраление, чтобы добавить в каталог.</p>
        </div> 
    </div>
    





    <!-- <script src="script.js"></script> -->
    <?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>