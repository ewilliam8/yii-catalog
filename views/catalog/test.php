<?php 
    use yii\widgets\ActiveForm;
    use yii\helpers\Html;
?>
<h1>TEST ACTION</h1>

<?php if (Yii::$app->session->hasFlash('success')):  ?>
    <?php echo Yii::$app->session->getFlash('success');  ?>
<?php endif;?>

<?php if (Yii::$app->session->hasFlash('error')):  ?>
    <?php echo Yii::$app->session->getFlash('error');  ?>
<?php endif;?>

<?php $form = ActiveForm::begin(['options' => ['id' => 'testForm']]) ?>
<?= $form->field($model, 'name') ?>
<?= $form->field($model, 'email') ?>
<?= $form->field($model, 'text')->textarea() ?>
<?= Html::submitButton('Отправить', ['class' => 'btn btn-success']) ?>
<?php ActiveForm::end() ?>